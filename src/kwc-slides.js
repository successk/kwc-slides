(() => {
  "use strict";

  class KwcSlides {
    beforeRegister() {
      this.is = "kwc-slides";

      this.properties = {
        slide: {
          type: String,
          value: null,
          observer: "_slideChanged"
        },
        start: {
          type: String,
          value: null
        },
        fullScreen: {
          type: Boolean,
          value: false
        },
        enableGotoButton: {
          type: Boolean,
          value: false
        },
        showGotoButton: {
          type: Boolean,
          value: false
        },
        totalSlides: {
          type: Number,
          value: 0,
          readOnly: true
        },
        slideIndex: {
          type: Number,
          value: 0,
          readOnly: true
        },
        width: {
          type: Number,
          value: 500
        },
        height: {
          type: Number,
          value: 500
        },
        background: {
          type: String,
          value: null
        },
        fullBackground: {
          type: String,
          value: null
        },
        styleContainer: {
          type: String,
          computed: "_computeStyleContainer(width, fullScreen)"
        },
        styleSlides: {
          type: String,
          computed: "_computeStyleSlides(width, height, background)"
        },
        styleSlidesContainer: {
          type: String,
          computed: "_computeStyleSlidesContainer(fullBackground)"
        },
        hideSlideNumber: {
          type: Boolean,
          value: false
        }
      };

      this.listeners = {
        "previous.tap": "_previousTap",
        "next.tap": "_nextTap",
        "fullscreen.tap": "_fullscreenTap",
        "gotoButton.tap": "_gotoButtonTap",
        "inputSlideIndex.input": "_inputSlideIndexInput"
      };
    }

    _inputSlideIndexInput(e) {
      const slides = Array.from(this.querySelectorAll("kwc-slide"));
      if (1 <= e.target.value && e.target.value <= slides.length) {
        this.slide = slides[e.target.value - 1].getAttribute("name");
      }
    }

    attachedCallback() {
      this.addEventListener("keydown", (e) => {
        if (!e.target || !e.target.hasAttribute("id") || e.target.getAttribute("id") !== "inputSlideIndex") {
          if (e.keyCode === 33) {
            this._pageupPressed(e);
          } else if (e.keyCode === 34) {
            this._pagedownPressed(e);
          } else if (e.keyCode === 37) {
            this._leftPressed(e);
          } else if (e.keyCode === 38) {
            this._upPressed(e);
          } else if (e.keyCode === 39) {
            this._rightPressed(e);
          } else if (e.keyCode === 40) {
            this._downPressed(e);
          } else if (e.keyCode === 27) {
            this._escapePressed(e);
          }
        }
      }, true);

      window.addEventListener("resize", (e) => {
        this._windowResized(e);
      });

      this.addEventListener("mousemove", (e) => {
        this._mousemoved(e);
      });

      this._buildTitles();
      this._updateTitlesOnMasks();

      setTimeout(() => {
        // Go out of flow
        const slides = this.querySelectorAll("kwc-slide");
        const masks = Array.from(this.querySelectorAll("kwc-slide-mask"));
        const masksHeight = masks.length > 0 ? masks.map(m => m.offsetHeight).reduce((acc, height) => acc + height) : 0;
        masks.forEach(m => m.slidesCount = slides.length);
        this._setTotalSlides(slides.length);
        slides.forEach((slide) => {
          slide.setAttribute("width", this.width);
          slide.setAttribute("height", this.height - masksHeight);
        });
        if (this.start) {
          this.slide = this.start;
        } else {
          this.slide = this.querySelector("kwc-slide").name;
        }
      }, 1);
    }

    _computeStyleContainer(width, fullScreen) {
      if (fullScreen) {
        return "";
      } else {
        return `width:${width}px`;
      }
    }

    _computeStyleSlidesContainer(fullBackground) {
      const styles = [];
      if (fullBackground) {
        this._pushBackgroundStyles(styles, fullBackground);
      }
      return styles.join(";");
    }

    _computeStyleSlides(width, height, background) {
      const styles = [
        `width:${width}px`,
        `height:${height}px`
      ];
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

    _buildTitles() {
      const slides = Array.from(this.querySelectorAll("kwc-slide"));
      const titles = {};
      let previousHeaders = [];
      slides.forEach((slide) => {
        const currentHeaders = [];
        let hasPreviousTitle = false;
        for (let i = 0; i < 10; i++) {
          const attr = `h${i + 1}`;
          if (slide.hasAttribute(attr)) {
            const header = slide.getAttribute(attr);
            hasPreviousTitle = true;
            if (header === "_none_") {
              break;
            } else {
              currentHeaders[i] = header;
            }
          } else if (hasPreviousTitle) {
            break;
          } else {
            if (previousHeaders.length <= i) {
              break;
            } else {
              currentHeaders[i] = previousHeaders[i];
            }
          }
        }
        titles[slide.getAttribute("name")] = currentHeaders;
        previousHeaders = currentHeaders;
      });
      this._titles = titles;
    }

    _previousTap(e) {
      e.preventDefault();
      this._previous();
    }

    _nextTap(e) {
      e.preventDefault();
      this._next();
    }

    _fullscreenTap(e) {
      e.preventDefault();
      this._fullScreen();
    }

    _pageupPressed(e) {
      e.preventDefault();
      this._previous();
    }

    _pagedownPressed(e) {
      e.preventDefault();
      this._next();
    }

    _upPressed(e) {
      e.preventDefault();
      this._previous();
    }

    _downPressed(e) {
      e.preventDefault();
      this._next();
    }

    _leftPressed(e) {
      e.preventDefault();
      this._previous();
    }

    _rightPressed(e) {
      e.preventDefault();
      this._next();
    }

    _gotoButtonTap(e) {
      e.preventDefault();
      this._exitFullScreen().then(() => {
        if (this._currentSlide.hasGotoLink) {
          const goto = this._currentSlide.goto;
          if (goto.startsWith("#")) {
            // We wait the end off full screen exit, otherwise the browser does not trigger "go to hash" action.
            // We remove current hash and reset it to force "go to hash" action.
            window.location.hash = "#";
            window.location.hash = goto;
          } else {
            window.location.href = goto;
          }
        }
      });
    }

    _windowResized(e) {
      this._resize();
    }

    _escapePressed(e) {
      this._exitFullScreen();
    }

    _mousemoved(e) {
      if (this.fullScreen) {
        // The following condition filter event due to keyboard inputs
        // Behavior encountered in chrome 53
        if (this._oldClientX !== e.clientX && this._oldClientY !== e.clientY) {
          this._oldClientX = e.clientX;
          this._oldClientY = e.clientY;
          this.classList.remove("hide-actions");
          if (this.hideMouseInterval) {
            clearTimeout(this.hideMouseInterval);
          }
          if (!this._isParentNode(e.target, this.$.actions)) {
            this.hideMouseInterval = setTimeout(() => {
              this.classList.add("hide-actions");

              // Enable keyboard inputs after a focused button is hidden.
              if (this.$.inputSlideIndex !== document.activeElement) {
                this.$.slidesContainer.focus();
              }
            }, 2500);
          }
        }
      }
    }

    _isParentNode(child, parent) {
      let current = child;
      while (current && current !== parent) {
        current = current.parentNode;
      }
      return !!(current && current === parent);
    }

    _previous() {
      if (this._currentSlide.hasAttribute("previous")) {
        this.slide = this._currentSlide.getAttribute("previous");
      } else {
        const slides = this.querySelectorAll("kwc-slide");
        for (let i = 1, c = slides.length; i < c; i++) {
          if (slides[i].getAttribute("name") === this.slide) {
            this.slide = slides[i - 1].getAttribute("name");
            break;
          }
        }
      }
    }

    _next() {
      if (this._currentSlide.hasAttribute("next")) {
        this.slide = this._currentSlide.getAttribute("next");
      } else {
        const slides = this.querySelectorAll("kwc-slide");
        for (let i = 0, c = slides.length - 1; i < c; i++) {
          if (slides[i].getAttribute("name") === this.slide) {
            this.slide = slides[i + 1].getAttribute("name");
            break;
          }
        }
      }
    }

    _fullScreen() {
      if (this.classList.contains("full-screen")) {
        this._exitFullScreen();
      } else {
        this._enterFullScreen();
      }
    }

    _enterFullScreen() {
      this.fullScreen = true;
      this.classList.add("full-screen");
      const documentElement = document.documentElement;
      if (documentElement.requestFullScreen) {
        documentElement.requestFullScreen();
      } else if (documentElement.mozRequestFullScreen) {
        documentElement.mozRequestFullScreen();
      } else if (documentElement.webkitRequestFullScreen) {
        documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
      this._resize();
    }

    _exitFullScreen() {
      this.fullScreen = false;
      this.classList.remove("full-screen");
      let promise = Promise.resolve();
      if (document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen) {
        const promise = this._createFullScreenChangePromise();
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
      this._resize();
      if (this.hideMouseInterval) {
        clearTimeout(this.hideMouseInterval);
      }
      this.classList.remove("hide-actions");
      return promise;
    }

    _createFullScreenChangePromise() {
      return new Promise((resolve) => {
        const handler = () => {
          resolve();
          document.removeEventListener("fullscreenchange", handler);
          document.removeEventListener("webkitfullscreenchange", handler);
          document.removeEventListener("mozfullscreenchange", handler);
          document.removeEventListener("msfullscreenchange", handler);
        };
        document.addEventListener("fullscreenchange", handler);
        document.addEventListener("webkitfullscreenchange", handler);
        document.addEventListener("mozfullscreenchange", handler);
        document.addEventListener("msfullscreenchange", handler);
      });
    }

    _resize() {
      if (this.fullScreen) {
        const scale = Math.min(
          this.$.slidesContainer.offsetWidth / this.width,
          this.$.slidesContainer.offsetHeight / this.height
        );
        this.$.slides.style.transform = `scale(${scale})`;
      } else {
        this.$.slides.style.transform = "none";
      }
    }

    _slideChanged(name) {
      Array.from(this.querySelectorAll("kwc-slide")).forEach((slide, index) => {
        if (slide.getAttribute("name") === name) {
          slide.show = true;
          this._setSlideIndex(index + 1);
          Array.from(this.querySelectorAll("kwc-slide-mask")).forEach(m => m.slide = index + 1);
        } else {
          slide.show = false;
        }
      });
      this.enableGotoButton = this._currentSlide && this._currentSlide.hasGotoLink;
      this._updateTitlesOnMasks();
    }

    _updateTitlesOnMasks() {
      if (this._titles) {
        Array.from(this.querySelectorAll("kwc-slide-mask")).forEach(m => m.breadcrumb = this._titles[this.slide]);
      }
    }

    get _currentSlide() {
      return this.querySelector(`kwc-slide[name=${this.slide}]`);
    }
  }

  Polymer(KwcSlides);
})();