import CheckboxView from 'ampersand-checkbox-view'

export default CheckboxView.extend({
  template: `
    <div class="checkbox">
      <label>
        <input type="checkbox"> <span data-hook="label">Check me out</span>
      </label>
      <div data-hook="message-container" class="message message-below message-error">
        <p data-hook="message-text"></p>
      </div>
    </div>`
})
