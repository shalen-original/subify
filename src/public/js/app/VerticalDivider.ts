import {constants} from './constants.js';

export default class VerticalDivider {
    
        /* THIS ONE IS THE VERTICAL ONE! (like this: | ) */

    private verticalDivider: Element;
    private leftBox: HTMLElement;
    private appContainer: any;

    private deltaX: number;
    private startX: number;
    private initialWidth: number;
    private draggingVertically: Boolean;

    private offset: number;

    constructor() {
        let vd = document.querySelector("#div-vert");
        if(!vd) throw 'VerticalDivider can not be null';

        let lb = document.querySelector("#app-table");
        if(!lb) throw 'LeftBox can not be null';

        let ac = document.querySelector("#app");
        if(!ac) throw 'AppContainer can not be null';

        this.verticalDivider = vd;
        this.leftBox = lb as HTMLElement;
        this.appContainer = ac as HTMLElement;

        this.draggingVertically = false;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.update = this.update.bind(this);

        this.verticalDivider.addEventListener("mousedown", this.onMouseDown as EventListener);
        window.addEventListener("mouseup", this.onMouseUp);
        window.addEventListener("mousemove", this.onMouseMove);

        this.verticalDivider.addEventListener("touchstart", this.onMouseDown as EventListener);
        window.addEventListener("touchend", this.onMouseUp);
        window.addEventListener("touchmove", this.onMouseMove);

        // Get sidebar width
        this.offset = constants.sidebarXInset;
    }

    private onMouseDown(evt: MouseEvent | TouchEvent): void {
        evt.preventDefault();

        this.draggingVertically = true
        this.initialWidth = this.leftBox.offsetWidth;
        this.startX = (evt instanceof MouseEvent) ? evt.pageX : evt.touches[0].pageX;
        this.deltaX = 0;

        requestAnimationFrame(this.update);
    }

    private onMouseUp(): void {
        this.draggingVertically = false;
    }

    private onMouseMove(evt: MouseEvent | TouchEvent): void {
        if (this.draggingVertically){
            let x = (evt instanceof MouseEvent) ? evt.pageX : evt.touches[0].pageX;
            this.deltaX = this.startX - x;
        }
    }

    private update(): void {
        if(!this.draggingVertically) return;

        //let freeSpace = this.appContainer.clientWidth - constants.dividerWidth;
        let left = Math.floor(this.initialWidth - this.deltaX);

        this.appContainer.style.gridTemplateColumns = `${left}px ${constants.dividerWidth}px auto`;        
        requestAnimationFrame(this.update);
    }
};
