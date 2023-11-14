if (!customElements.get('localization-form')) {
  customElements.define(
    'localization-form',
    class LocalizationForm extends HTMLElement {
      constructor() {
        super();
        this.elements = {
          input: this.querySelector('input[name="locale_code"], input[name="country_code"]'),
          button: this.querySelector('.disclosure__button'),
          panel: this.querySelector('.disclosure__list-wrapper'),
          overlay: this.querySelector('.country-selector__overlay'),
          closeButton: this.querySelector('#close-country-selector'),
          search: this.querySelector('input[name="country_filter"]'),
        };
        this.elements.button.addEventListener('click', this.openSelector.bind(this));
        this.elements.button.addEventListener('click', this.openModal.bind(this));
        this.elements.overlay.addEventListener('click', this.closeModal.bind(this));
        this.elements.closeButton.addEventListener('click', this.closeModal.bind(this));
        this.elements.button.addEventListener('focusout', this.closeSelector.bind(this));
        this.elements.search.addEventListener('keyup', this.filterCountries.bind(this));
        this.addEventListener('keyup', this.onContainerKeyUp.bind(this));

        this.querySelectorAll('a').forEach((item) => item.addEventListener('click', this.onItemClick.bind(this)));
      }

      hidePanel() {
        this.elements.button.setAttribute('aria-expanded', 'false');
        this.elements.panel.setAttribute('hidden', true);
      }

      hideModal() {
        this.elements.button.setAttribute('aria-expanded', 'false');
        this.elements.overlay.classList.add('hidden')
      }

      onContainerKeyUp(event) {
        if (event.code.toUpperCase() !== 'ESCAPE') return;

        if (this.elements.button.getAttribute('aria-expanded') == 'false') return;
        this.hidePanel();
        event.stopPropagation();
        this.elements.button.focus();
      }

      onItemClick(event) {
        event.preventDefault();
        const form = this.querySelector('form');
        this.elements.input.value = event.currentTarget.dataset.value;
        if (form) form.submit();
      }

      openSelector() {
        this.elements.button.focus();
        this.elements.panel.toggleAttribute('hidden');
        this.elements.button.setAttribute(
          'aria-expanded',
          (this.elements.button.getAttribute('aria-expanded') === 'false').toString()
        );
      }

      closeSelector(event) {
        const isChild =
          this.elements.panel.contains(event.relatedTarget) || this.elements.button.contains(event.relatedTarget);
        if (!event.relatedTarget || !isChild) {
          this.hidePanel();
        }
      }

      openModal() {
        this.elements.overlay.classList.remove('hidden');
        this.elements.button.setAttribute('aria-expanded', 'true');
      }

      closeModal(event) {
        if (event.target === this.elements.overlay || event.target === this.elements.closeButton || event.target.parentElement === this.elements.closeButton)
        this.hideModal();
      }

      filterCountries() {
        const searchValue = this.elements.search.value.toLowerCase();
        const continents = this.querySelectorAll('.continent');

        if (searchValue) {
          this.querySelector('.popular-countries').style.display = "none";
        } else {
          this.querySelector('.popular-countries').style.display = "grid";
        }

        this.querySelectorAll('.countries a').forEach((item) => {
          const countryName = item.textContent.toLowerCase();
          if (countryName.indexOf(searchValue) > -1) {
            item.parentElement.style.display = "block";
          } else {
            item.parentElement.style.display = "none";
          }
        });

        continents.forEach((continent) => {
          const countryItems = continent.querySelectorAll('.countries a');

          const allCountriesHidden = Array.from(countryItems).every((item) => {
            return item.parentElement.style.display === "none";
          });

          if (allCountriesHidden) {
            continent.style.display = "none";
          } else {
            continent.style.display = "block";
          }
        });
      }
    }
  );
}
