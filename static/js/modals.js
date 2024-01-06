var modal;

function toggleModal(modal) {
  modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
  if(event.target === modal) {
    toggleModal();
  }
}

function createModalContext(self) {
  if(self._selector) {
    // continue and create the modal
    const modal = document.createElement("div");
    const modal_content = document.createElement("div");
    const close_button = document.createElement("span");
    const modal_title = document.createElement("h2");

    // define classes
    modal.classList.add("modal");
    modal_content.classList.add("modal-content");
    close_button.classList.add("close-button");
    modal_title.classList.add("modal-title");

    // append these objects
    document.body.appendChild(modal);
    modal.appendChild(modal_content);
    modal_content.appendChild(close_button);
    modal_content.appendChild(modal_title);

    // finished
    return modal;
  } else {
    // pass
    console.log("[⚠] Warning: Modal context not made correctly.");
    return null;
  }
}

class Modal {
  constructor(selector) {
    this._selector = selector;
    this._modal = createModalContext(this);
    modal = this._modal;
  }
  
  _toggleModal() {
    toggleModal(this._modal);
  }
  
  _getModal() {
    return document.querySelector(this._selector);
  }
  
  _getCloseButton() {
    return this._getModal().querySelector(".close-button");
  }
  
  _getTitle() {
    return this._getModal().querySelector(".modal-title");
  }
  
  _getContent() {
    return this._getModal().querySelector(".modal-content");
  }
  
  close() {
    return this._getCloseButton().click();
  }
  
  setContent(htmlContent) {
    this._getContent().innerHTML=htmlContent;
  }
  
  setTitle(title) {
    this._getTitle().textContent=title;
  }
}

//trigger.addEventListener("click", toggleModal);
//closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

export { Modal };