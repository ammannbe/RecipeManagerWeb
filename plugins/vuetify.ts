export default function ({ $vuetify }: any) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  $vuetify.theme.dark = mq.matches

  mq.addEventListener('change', (e) => {
    $vuetify.theme.dark = e.matches
  })
}
