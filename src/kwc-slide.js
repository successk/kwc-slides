(() => {
  "use strict";

  class KwcSlide {
    beforeRegister() {
      this.is = "kwc-slide";

      this.properties = {
        type: {
          type: String,
          value: null
        },
        width: {
          type: Number,
          value: null,
          observer: "_sizeChanged"
        },
        height: {
          type: Number,
          value: null,
          observer: "_sizeChanged"
        },
        show: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          observer: "_showChanged"
        },
        background: {
          type: String,
          value: null
        },
        styleSlide: {
          type: String,
          computed: "_computeStyleSlide(background)"
        }
      };
    }

    isType(type, wanted) {
      return type === wanted;
    }

    _sizeChanged() {
      Array.from(Polymer.dom(this).querySelectorAll(".figure")).forEach((figure) => {
        figure.style.width = (this.width || 0) + "px";
        figure.style.height = (this.height || 0) + "px";
      });
    }

    _showChanged() {
      setTimeout(() => {
        Array.from(Polymer.dom(this).querySelectorAll("figure")).forEach((figure) => {
          const scrollHeight = figure.scrollHeight;
          const heightRatio = this.height / scrollHeight;
          Array.from(figure.querySelectorAll("img")).forEach((img) => {
            const maxHeight = Math.min(img.clientHeight * heightRatio, img.clientHeight);
            img.style.maxHeight = maxHeight + "px";
          });
        });
      }, 1);
    }

    _computeStyleSlide(background) {
      const styles = [];
      if (background) {
        this._pushBackgroundStyles(styles, background);
      }
      return styles.join(";");
    }

    _pushBackgroundStyles(styles, background) {
      if (background.startsWith("#") || background.startsWith("rgb")) {
        styles.push(`background-color:${background}`);
      } else {
        styles.push(`background-image:url(${background})`);
        styles.push("background-size:100% 100%");
      }
    }
  }

  Polymer(KwcSlide);
})();