import client from 'webpack-theme-color-replacer/client'
import forElementUI from 'webpack-theme-color-replacer/forElementUI'

export default (color) => {
  const options = {
    newColors: forElementUI.getElementUISeries(color)
  }
  client.changer.changeColor(options, Promise)
}
