import EventBus from './EventBus.js';
import LocalVideo from './LocalVideo.js'
import SubtitleTable from './SubtitleTable.js';

// Suggested by Typescript github, basically extending
// the global "Element" interface. When the vendor specific prefixes
// are gone, this can be removed
declare global{
    interface Element {
        mozRequestFullScreen(): void;
    }
}

export default class VideoControls {

    private eventBus: EventBus;
    private video: HTMLVideoElement;
    private playButton: HTMLElement;
    private fullScreenButton: HTMLElement;
    private muteButton: HTMLElement;
    private seekBar: HTMLInputElement;
    private volumeBar: HTMLInputElement;
    private currentTimeLabel: HTMLElement;
    private totalTimeLabel: HTMLElement;
    private playIcon: any;

    private isVideoPlaying: boolean;

    constructor(video: HTMLVideoElement, eventBus: EventBus) {
    
        this.video = video;
        this.eventBus = eventBus;

        /* Controls */
        this.playButton = document.getElementById("btn-play") as HTMLElement;
        this.muteButton = document.getElementById("btn-mute") as HTMLElement;
        this.fullScreenButton = document.getElementById("btn-full-screen") as HTMLElement;
        this.seekBar = document.getElementById("progress") as HTMLInputElement;
        this.volumeBar = document.getElementById("volume") as HTMLInputElement;
        this.currentTimeLabel = document.getElementById("current-time") as HTMLElement;
        this.totalTimeLabel = document.getElementById("total-time") as HTMLElement;
        
        this.playIcon = document.getElementById('btn-play-toggle') as any;
        this.playIcon.classList.replace('fa-pause', 'fa-play');

        let duration: string = this.timeParse(this.video.duration);
        this.totalTimeLabel.innerHTML = duration;

        this.isVideoPlaying = false;

        /* Callbacks */
        this.onPlayBtnClick = this.onPlayBtnClick.bind(this);
        this.onMuteBtnClick = this.onMuteBtnClick.bind(this);
        this.onVolumeBarAction = this.onVolumeBarAction.bind(this);
        this.onFullScreenBtnClick = this.onFullScreenBtnClick.bind(this);
        this.onSeekBarAction = this.onSeekBarAction.bind(this);
        this.onVideoPlay = this.onVideoPlay.bind(this);
        this.onVideoPause = this.onVideoPause.bind(this);

        this.updateSeekbar = this.updateSeekbar.bind(this);


        /* External Events */
        this.eventBus.addEventListener(LocalVideo.EVT_VIDEO_PLAY, this.onVideoPlay);
        this.eventBus.addEventListener(LocalVideo.EVT_VIDEO_PAUSE, this.onVideoPause);

        /* Listeners */
        this.playButton.addEventListener("click", this.onPlayBtnClick);
        this.muteButton.addEventListener("click", this.onMuteBtnClick);
        this.volumeBar.addEventListener("change", this.onVolumeBarAction);
        this.fullScreenButton.addEventListener("click", this.onFullScreenBtnClick);
        this.seekBar.addEventListener("change", this.onSeekBarAction);

        /* Pause Video when dragging the seekbar handle */
        this.seekBar.addEventListener("mousedown", function() {
            video.pause();
        });
    }

    private onPlayBtnClick(): void {
        if(this.video.paused == true) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    private onVideoPlay(): void { 
        this.playIcon.classList.replace('fa-play', 'fa-pause');
        
        // Starts to update the seekbar
        this.isVideoPlaying = true;
        window.requestAnimationFrame(this.updateSeekbar);
    }
    private onVideoPause(): void {
        this.playIcon.classList.replace('fa-pause', 'fa-play'); 

        // Stops the seekbar updating
        this.isVideoPlaying = false;
    }

    private onMuteBtnClick(): void {
        if (this.video.muted == false) {
            this.video.muted = true;
            this.volumeBar.value = '0';
            let icon = this.muteButton.childNodes[0] as any;
            icon.classList.replace('fa-volume-up', 'fa-volume-off');
        } else {
            this.video.muted = false;
            this.volumeBar.value = ''+(this.video.volume*100);
            let icon = this.muteButton.childNodes[0] as any;
            icon.classList.replace('fa-volume-off', 'fa-volume-up');
         }
    }

    private onVolumeBarAction(): void {
        this.video.volume = parseInt(this.volumeBar.value)/100;
    }

    private onFullScreenBtnClick(): void {
        if (this.video.requestFullscreen) {
            this.video.requestFullscreen();
        } else if (this.video.mozRequestFullScreen) {
            this.video.mozRequestFullScreen();
        } else if (this.video.webkitRequestFullscreen) {
            this.video.webkitRequestFullscreen();
        }
    }

    private onSeekBarAction(): void {
        let time = this.video.duration * (parseInt(this.seekBar.value) / 100);
        this.video.currentTime = time;
    }

    private updateSeekbar (): void {
        let duration: number = this.video.duration,
            currentTime: number = this.video.currentTime;
        
        let ct = this.timeParse(currentTime);
        let tt = this.timeParse(duration);
        this.currentTimeLabel.innerHTML = ct;
        this.totalTimeLabel.innerHTML = tt;

        var value = (100 / duration) * currentTime;
        this.seekBar.value = ''+value;

        if (this.isVideoPlaying)
            window.requestAnimationFrame(this.updateSeekbar);
    }

    private timeParse(time: number): string {
        if(isNaN(time)) { time = 0; }
        let minutes: string = Math.trunc(time / 60).toString();
        let seconds: string = Math.trunc(time % 60).toString();

        return minutes + ':' + seconds.padStart(2, "0");
    }
}
