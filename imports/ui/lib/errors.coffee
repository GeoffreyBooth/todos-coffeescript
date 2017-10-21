import i18n from 'meteor/universe:i18n'


export displayError = (error) ->
  if error?
    # It would be better to not alert the error here but inform the user in some
    # more subtle way
    alert i18n.__ error.error
