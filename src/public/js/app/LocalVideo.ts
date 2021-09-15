import EventBus from './EventBus.js';
import SubtitleTable from './SubtitleTable.js';
import VideoControls from './VideoControls.js'

export default class LocalVideo {

    public static readonly EVT_VIDEO_CHANGED: string = 'videoChanged';
    public static readonly EVT_TIME_UPDATED: string = 'timeUpdated';
    public static readonly EVT_SUBTITLE_UPDATED: string = 'subtitleUpdated';
    public static readonly EVT_VIDEO_PLAY: string = 'videoPlay';
    public static readonly EVT_VIDEO_PAUSE: string = 'videoPause';

    private videoElement: HTMLVideoElement;
    private inputElement: HTMLInputElement;
    private startupElement: HTMLElement;
    private videoUrl: string;
    private eventBus: EventBus;
    private controls: VideoControls;

    constructor(videoElement: HTMLVideoElement, inputElement: HTMLInputElement, startupElement: HTMLElement, eventBus: EventBus) {
        this.videoElement = videoElement;
        this.inputElement = inputElement;
        this.startupElement = startupElement;
        this.inputElement.addEventListener('change', this.onInputChange.bind(this));
        this.videoElement.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
        this.videoElement.addEventListener('play', this.onVideoPlay.bind(this));
        this.videoElement.addEventListener('pause', this.onVideoPause.bind(this));
        this.eventBus = eventBus;
        this.eventBus.addEventListener(SubtitleTable.EVT_SUBTITLE_TEXT_CHANGED, this.onSubtitleTextChanged.bind(this));

        this.controls = new VideoControls(this.videoElement, this.eventBus);
    }

    private onInputChange(evt: Event): void {
        let trg = evt.target as HTMLInputElement;
        if(!trg || !trg.files || !trg.files[0]) throw 'evt.target should not be null';
        let file = trg.files[0];
        if(!file) throw 'evt.target.files should not be null';

        this.startupElement.classList.add("hidden");
        this.videoElement.classList.remove("hidden");

        this.videoUrl = URL.createObjectURL(file);
        this.videoElement.setAttribute('src', this.videoUrl);
        this.videoElement.load();

        this.videoElement.addEventListener('durationchange', () => {
            let duration = this.videoElement.duration;
            this.eventBus.dispatchEvent(new CustomEvent(LocalVideo.EVT_VIDEO_CHANGED, {
                detail: { 
                    videoUrl: this.videoUrl,
                    duration: duration
                }
            }));
        });
    }

    // Need this two for play/pause toggle button
    private onVideoPlay(evt: Event): void {
        this.eventBus.dispatchEvent(new CustomEvent(LocalVideo.EVT_VIDEO_PLAY));
    }
    private onVideoPause(evt: Event): void {
        this.eventBus.dispatchEvent(new CustomEvent(LocalVideo.EVT_VIDEO_PAUSE));
    }

    private onTimeUpdate(evt: Event): void {
        let trg = evt.target as HTMLVideoElement;
        if(!trg) throw 'evt.target should not be null';
        let time = trg.currentTime;

        this.eventBus.dispatchEvent(new CustomEvent(LocalVideo.EVT_TIME_UPDATED, {
            detail: { currentTime: time }
        }));
    }
    
    private onSubtitleTextChanged(evt: CustomEvent): void {
        let oldSubsTrack: HTMLElement | null = this.videoElement.querySelector("track");
        let newSubsTrack: HTMLElement = document.createElement("track");

        // Emit event each time subtitles are updated
        newSubsTrack.addEventListener('cuechange', () => {
            
            let track = document.getElementsByTagName('track')[0] as HTMLTrackElement | null;
            
            if(track){
                let cl = track.track.activeCues
                let end: number = -1,
                    start: number = -1;
                if(cl[0]) {
                    start = cl[0].startTime;
                    end = cl[cl.length -1].endTime;
                }
                this.eventBus.dispatchEvent(new CustomEvent(LocalVideo.EVT_SUBTITLE_UPDATED, {
                    detail: {
                        subStart: start,
                        subEnd: end
                    }
                }));
            }
        });

        newSubsTrack.setAttribute("src", evt.detail.fileUrl);
        newSubsTrack.setAttribute("default", "default");

        if (oldSubsTrack)
          this.videoElement.replaceChild(newSubsTrack, oldSubsTrack);
        else
          this.videoElement.appendChild(newSubsTrack);
    }
};
