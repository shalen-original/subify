import EventBus from './../EventBus.js';

export default class ModalWindow {
    protected modalElement : HTMLElement;
    protected eventBus: EventBus;

    constructor(modalElement: HTMLElement, eBus: EventBus){
        this.modalElement = modalElement;
        this.eventBus = eBus;

        // Binding function to this
        this.show = this.show.bind(this);
        this.dismiss = this.dismiss.bind(this);

        // If the user clicks on the background the modal is dismissed
        let bg = this.modalElement.querySelector(".modal-background");
        if (!bg) throw "The background of the modal element cannot be null";
        bg.addEventListener("click", this.dismiss); 

        // If the user clicks on the "x" the modal is dismissed
        let bx = this.modalElement.querySelector(".modal-close");
        if (bx) bx.addEventListener("click", this.dismiss);         
    }

    protected show(evt: CustomEvent): void {
        this.modalElement.className = "modal is-active";
    }

    protected dismiss(): void {
        this.modalElement.className = "modal";
    }

}
