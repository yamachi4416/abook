export default ({ app, $auth }) => {
  $auth.languageCode = app.i18n.locale

  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    $auth.languageCode = newLocale
  }
}
