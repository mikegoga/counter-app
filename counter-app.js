/**
 * Copyright 2026 mikegoga
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `counter-app`
 * 
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.count = 0;
    this.min = 0;
    this.max = 25;
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/counter-app.ar.json", import.meta.url).href +
        "/../",
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      count: { type: Number, reflect: true},
      min: { type: Number, reflect: true },
      max: { type: Number, reflect: true },

    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      
      .count {
          margin: 0;
          line-height: 1;
          font-size: var(
            --counter-app-label-font-size,
            var(--ddd-font-size-xl)
          );
          letter-spacing: -0.02em;
        }

      /* color changes when we hit 18 */
      :host([count="18"]) h3 {
        color: var(--ddd-theme-default-landgrantBrown);
      }

      /* color changes when we hit 21 */
      :host([count="21"]) h3 {
        color: var(--ddd-theme-default-athertonViolet);
      }

       /* change color at min/max */
      :host([at-min]) .count,
        :host([at-max]) .count {
          color: var(--ddd-theme-default-original87Pink);
        }

      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }

      h3 span {
        font-size: var(--counter-app-label-font-size, var(--ddd-font-size-s));
      }

       .controls {
          margin-top: var(--ddd-spacing-4);
          display: flex;
          gap: var(--ddd-spacing-2);
          align-items: center;
        }

         button {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          border-radius: var(--ddd-radius-sm);
          border: 2px solid var(--ddd-theme-primary);
          background: transparent;
          color: var(--ddd-theme-primary);
          cursor: pointer;
          transition: transform 120ms ease-in-out;
        }

        button:hover:not([disabled]) {
          transform: translateY(-1px);
        }

        button:focus-visible {
          outline: 3px solid var(--ddd-theme-default-athertonViolet);
          outline-offset: 2px;
        }

        button[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .extras {
          margin-top: var(--ddd-spacing-4);
        }

    `];
  }

  // Lit render the HTML
  render() {
    const atMin = this.count <= this.min;
    const atMax = this.count >= this.max;

    return html`
      <confetti-container id="confetti">
        <div class="wrapper">
          <h3 class="count">${this.count}</h3>

          <div class="controls">
            <button
              @click="${this.decrement}"
              ?disabled="${atMin}"
            >
              -
            </button>

            <button
              @click="${this.increment}"
              ?disabled="${atMax}"
            >
              +
            </button>
          </div>

          <div class="extras">
            <slot></slot>
          </div>
        </div>
      </confetti-container>
    `;
  }

  /* ensure valid range */
   willUpdate(changedProperties) {
    if (this.min > this.max) {
      const temp = this.min;
      this.min = this.max;
      this.max = temp;
    }

    if (this.count < this.min) this.count = this.min;
    if (this.count > this.max) this.count = this.max;

    super.willUpdate?.(changedProperties);
  }
  
   updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }

    if (changedProperties.has("count")) {
      // Toggle state attributes for styling
      this.toggleAttribute("at-min", this.count === this.min);
      this.toggleAttribute("at-max", this.count === this.max);

      // Confetti when hitting 21
      if (this.count === 21) {
        this.makeItRain();
      }
    }
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
 
  makeItRain() {
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(() => {
      setTimeout(() => {
        const confetti = this.shadowRoot?.querySelector("#confetti");
        if (confetti) {
          confetti.setAttribute("popped", "");
        }
      }, 0);
    });
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);