import LocalVideo from './app/LocalVideo.js';
import SubtitleInput from './app/SubtitleInput.js';
import SubtitleTable from './app/SubtitleTable.js';
import VerticalDivider from './app/VerticalDivider.js';
import SidebarControls from './app/SidebarControls.js';
import EventBus from './app/EventBus.js';
import ErrorModalWindow from './app/modals/ErrorModalWindow.js';
import TimeInputModalWindow from './app/modals/TimeInputModalWindow.js';

interface Iapp {
    videoPlayer: LocalVideo
    subtitleInput: SubtitleInput
    subtitleTable: SubtitleTable
    sidebarControls: SidebarControls
    eventBus : EventBus
    errorModalWindow: ErrorModalWindow
    timeInputModalWindow: TimeInputModalWindow
}

var app: Iapp = {
    videoPlayer: <LocalVideo>{},
    subtitleInput: <SubtitleInput>{},
    subtitleTable: <SubtitleTable>{},
    sidebarControls: <SidebarControls>{},
    eventBus: <EventBus>{},
    errorModalWindow: <ErrorModalWindow>{},
    timeInputModalWindow: <TimeInputModalWindow>{}
};

(window as any)['app'] = app;

window.onload = function() {

    app.eventBus = new EventBus();
    
    app.videoPlayer = new LocalVideo(
        document.querySelector('#local-video') as HTMLVideoElement,
        document.querySelector('#video-upload') as HTMLInputElement,
        document.querySelector('#startup-video') as HTMLInputElement,
        app.eventBus
    );
    app.subtitleInput = new SubtitleInput(
      document.querySelector('#subtitle-upload') as HTMLInputElement,
      app.eventBus
    );
    app.subtitleTable = new SubtitleTable(
      document.querySelector('#subtitle-table') as HTMLTableElement,
      document.querySelector('#subtitle-table-header') as HTMLTableElement,
      document.querySelector('#startup-app-table') as HTMLTableElement,
      document.querySelector('#btn-add-new-line') as HTMLTableElement,
      document.querySelector('#btn-delete-line') as HTMLTableElement,
      document.querySelector('#btn-shift-forward') as HTMLTableElement,
      document.querySelector('#btn-shift-backward') as HTMLTableElement,
      app.eventBus
    );
    app.sidebarControls = new SidebarControls(
        app.eventBus
    );
    app.errorModalWindow = new ErrorModalWindow(
        document.querySelector('#modal-error') as HTMLElement,
        app.eventBus
    );
    app.timeInputModalWindow = new TimeInputModalWindow(
        document.querySelector('#modal-input-time') as HTMLElement,
        app.eventBus
    );
    
    new VerticalDivider();
};
