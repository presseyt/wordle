import ReactDOM from 'react-dom';

function Modal({ children, open, onClose }) {
    return open
        ? ReactDOM.createPortal(
              <div className="Modal">
                  <div
                      className="Modal__overlay"
                      onClick={onClose}
                      tabIndex={-1}
                  />
                  <div className="Modal__content">
                      <button className="Modal__close" onClick={onClose}> X </button>
                      {children}
                  </div>
              </div>,
              document.getElementById('root'),
          )
        : null;
}

export default Modal;
