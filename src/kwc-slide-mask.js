(() => {
  "use strict";

  class KwcSlideMask {
    beforeRegister() {
      this.is = "kwc-slide-mask";

      this.properties = {
        slide: {
          type: Number,
          value: 0,
          observer: "_attrUpdated"
        },
        slidesCount: {
          type: Number,
          value: 0,
          observer: "_attrUpdated"
        },
        breadcrumb: {
          type: String,
          value: null,
          observer: "_attrUpdated"
        },
        breadcrumbSeparator: {
          type: String,
          value: ", "
        }
      };
    }

    get behaviors() {
      return [Polymer.Templatizer];
    }

    ready() {
      const template = this.querySelector("template");
      this.templatize(template);
    }

    attachedCallback() {
      this._attached = true;
      this._updateContent();
    }

    getContent() {
      const hasBreadcrumb = this.breadcrumb && this.breadcrumb.length > 0;
      return this.stamp({
        "kwc-has-breadcrumb": hasBreadcrumb,
        "kwc-breadcrumb": hasBreadcrumb ? this.breadcrumb.join(this.breadcrumbSeparator) : "",
        "kwc-slide": this.slide,
        "kwc-slides-count": this.slidesCount
      });
    }

    _attrUpdated() {
      this._updateContent();
    }

    _updateContent() {
      if (this._attached) {
        const dom = Polymer.dom(this);
        while (dom.lastChild) {
          dom.removeChild(dom.lastChild);
        }
        dom.appendChild(this.getContent().root);
      }
    }
  }
  Polymer(KwcSlideMask);
})();