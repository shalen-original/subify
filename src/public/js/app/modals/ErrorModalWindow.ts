import ModalWindow from './ModalWindow.js';
import EventBus from './../EventBus.js';

export default class ErrorModalWindow extends ModalWindow {
    public static readonly EVT_ERROR_MODAL_SHOW: string = 'showErrorModal';
    private errorMsg: HTMLElement;

    constructor(modalElement: HTMLElement, eBus: EventBus){
        super(modalElement, eBus);

        let em: HTMLElement | null = modalElement.querySelector("#error-message") as HTMLElement;
        if (!em) throw "The spot for the error message cannot be null";
        this.errorMsg = em;

        this.eventBus.addEventListener(ErrorModalWindow.EVT_ERROR_MODAL_SHOW, this.show);
    }

    protected show(evt: CustomEvent): void {
        this.errorMsg.innerText = evt.detail.msg;
        super.show(evt);
    }
}
