// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'


// Vuetify
import { createVuetify } from 'vuetify'
import { VDateInput } from 'vuetify/labs/VDateInput';
import colors from 'vuetify/util/colors';
export default createVuetify(
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guide
  {
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: colors.red.darken1, // #E53935
            secondary: colors.red.lighten4, // #FFCDD2
            main:"#191770"
          }
        },
      },
    },
    components:{
      VDateInput
    }
  }
)
