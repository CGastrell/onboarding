import App from 'ampersand-app'
import SelectView from 'components/select-view'
import bootbox from 'components/bootbox'

export default SelectView.extend({
  template: `
    <div>
      <label data-hook="label" class="control-label"></label>
      <div class="input-group">
        <select class="form-control comboselect"></select>
        <span class="input-group-btn">
          <button class="btn btn-primary settlement-add-button" type="button">+</button>
        </span>
      </div>
      <div data-hook="message-container">
        <p data-hook="message-text" class="alert alert-warning"></p>
      </div>
    </div>`,
  events: {
    'click .settlement-add-button': function (event) {
      const buttonElement = event.target
      bootbox.prompt(
        'Ingrese un nombre para el establecimiento',
        answer => {
          if (!answer) return

          App.state.settlements.add({nombre: answer})
          window.setTimeout(() => buttonElement.focus(), 500)
        }
      )
    }
  }
})
