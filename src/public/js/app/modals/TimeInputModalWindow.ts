import ModalWindow from './ModalWindow.js';
import ErrorModalWindow from './ErrorModalWindow.js';
import EventBus from './../EventBus.js';
import SubtitleTime from './../subtitles/SubtitleTime.js';

/*
 * Note: this class is not that well engineered, it is my fault.
 * If a second EVT_TIME_INPUT_MODAL_SHOW event is triggered before
 * the previous window has been dismissed, this class will be messed up.
 * For our needs, this behaviour is enough: if, in future, the modal window
 * system will have to be extended, this issue should be tackled.
 */
export default class TimeInputModalWindow extends ModalWindow {
    public static readonly EVT_TIME_INPUT_MODAL_SHOW: string = 'showTimeInputModal';

    private onSuccess: ((time: SubtitleTime) => void) | null;
    private onFailure: (() => void) | null;
    private isShown: boolean;

    private message: HTMLElement;
    private submitBtn: HTMLElement;
    private cancelBtn: HTMLElement;
    private timeInput: HTMLInputElement;

    constructor(modalElement: HTMLElement, eBus: EventBus){
        super(modalElement, eBus);

        this.isShown = false;
        this.onSuccess = null;
        this.onFailure = null;

        let msgIn: HTMLElement | null = modalElement.querySelector("#input-message") as HTMLElement;
        let okBtn: HTMLElement | null = modalElement.querySelector("#input-ok-button") as HTMLElement;
        let dlBtn: HTMLElement | null = modalElement.querySelector("#input-cancel-button") as HTMLElement;
        let timIn: HTMLInputElement | null = modalElement.querySelector("#input-time-input") as HTMLInputElement;

        if (!msgIn) throw "The spot for the input message cannot be null";
        if (!okBtn) throw "The button to confirm the modal input cannot be null";
        if (!dlBtn) throw "The button to cancel the modal input cannot be null";
        if (!timIn) throw "The time input element cannot be null";

        this.message = msgIn;
        this.submitBtn = okBtn;
        this.cancelBtn = dlBtn;
        this.timeInput = timIn;

        this.onSubmit = this.onSubmit.bind(this);
        this.hide = this.hide.bind(this);

        this.eventBus.addEventListener(TimeInputModalWindow.EVT_TIME_INPUT_MODAL_SHOW, this.show);
        this.submitBtn.addEventListener("click", this.onSubmit);
        this.cancelBtn.addEventListener("click", this.dismiss);
    }

    protected show(evt: CustomEvent): void {
        if (this.isShown) {
            throw new Error('Cannot show two input modal windows together');
        }

        this.message.innerText = evt.detail.msg;
        this.onSuccess = evt.detail.onSuccess;
        this.onFailure = evt.detail.onFailure;
        this.isShown = true;
        super.show(evt);
    }

    protected dismiss(): void {
        if (this.onFailure)
            this.onFailure();

        this.hide();
    }

    private onSubmit(): void {
        try {
            let st: SubtitleTime = SubtitleTime.fromString(this.timeInput.value);
            if (this.onSuccess) this.onSuccess(st);
        } catch (ex) {
            if (this.onFailure) this.onFailure();
            let details = { detail: { msg: "The given time value is invalid, a string in the format HH:mm:ss,SSS is expected." } };
            this.eventBus.dispatchEvent(new CustomEvent(ErrorModalWindow.EVT_ERROR_MODAL_SHOW, details));
        }

        this.hide();
    }

    private hide(): void {
        this.isShown = false;
        this.message.innerText = "";
        this.onSuccess = null;
        this.onFailure = null;
        super.dismiss();
    }
}
