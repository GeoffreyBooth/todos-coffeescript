/* global Todos Lists SimpleSchema Method */

Todos.methods = {};

Todos.methods.insert = new Method({
  name: 'Todos.methods.insert',
  schema: new SimpleSchema({
    listId: { type: String },
    text: { type: String }
  }),
  run({ listId, text }) {
    const list = Lists.findOne(listId);

    if (list.isPrivate() && list.userId !== this.userId) {
      throw new Meteor.Error('Todos.methods.insert.unauthorized',
        'Cannot add todos to a private list that is not yours');
    }

    const todo = {
      listId,
      text,
      checked: false,
      createdAt: new Date()
    };

    Lists.userIdDenormalizer.insert(todo);
    Lists.incompleteCountDenormalizer.insert(todo);
    Todos.insert(todo);
  }
});

Todos.methods.setCheckedStatus = new Method({
  name: 'Todos.methods.makeChecked',
  schema: new SimpleSchema({
    todoId: { type: String },
    newCheckedStatus: { type: Boolean }
  }),
  run({ todoId, newCheckedStatus }) {
    const todo = Todos.findOne(todoId);

    if (todo.checked === newCheckedStatus) {
      // The status is already what we want, let's not do any extra work
      return;
    }

    const list = todo.getList();

    if (list.isPrivate() && list.userId !== this.userId) {
      throw new Meteor.Error('Todos.methods.setCheckedStatus.unauthorized',
        'Cannot edit checked status in a private list that is not yours');
    }

    Todos.update(todoId, {$set: {
      checked: newCheckedStatus
    }});

    Lists.incompleteCountDenormalizer.inc(todo.listId, newCheckedStatus ? -1 : 1);
  }
});

Todos.methods.updateText = new Method({
  name: 'Todos.methods.updateText',
  schema: new SimpleSchema({
    todoId: { type: String },
    newText: { type: String }
  }),
  run({ todoId, newText }) {
    // This is complex auth stuff - perhaps denormalizing a userId onto todos
    // would be correct here?
    const todo = Todos.findOne(todoId);
    const list = todo.getList();

    if (list.isPrivate() && list.userId !== this.userId) {
      throw new Meteor.Error('Todos.methods.updateText.unauthorized',
        'Cannot edit todos in a private list that is not yours');
    }

    Todos.update(todoId, {
      $set: { text: newText }
    });
  }
});

Todos.methods.remove = new Method({
  name: 'Todos.methods.remove',
  schema: new SimpleSchema({
    todoId: { type: String }
  }),
  run({ todoId }) {
    const todo = Todos.findOne(todoId);
    const list = todo.getList();

    if (list.isPrivate() && list.userId !== this.userId) {
      throw new Meteor.Error('Todos.methods.remove.unauthorized',
        'Cannot remove todos in a private list that is not yours');
    }

    Todos.remove(todoId);

    if (!todo.checked) {
      Lists.incompleteCountDenormalizer.remove(todo);
    }
  }
});

// Get list of all method names on Todos
const TODOS_METHODS = _.pluck(Todos.methods, 'name');

// Only allow 5 todos operations per connection per second
DDPRateLimiter.addRule({
  name(name) {
    return _.contains(TODOS_METHODS, name);
  },

  // Rate limit per connection ID
  connectionId() { return true; }
}, 5, 1000);
