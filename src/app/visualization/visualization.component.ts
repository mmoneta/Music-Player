import { Component, Input, OnChanges, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { Howl } from 'howler';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.scss']
})
export class VisualizationComponent implements OnChanges, OnInit, OnDestroy {

  @Input() src: string;
  sound: any;
  timer = '0:00';
  duration = '0:00';
  sliderDown: boolean;
  saveSeek: any;

  keyboardSubscription: Subscription;

  @ViewChild('view') view: ElementRef;
  @ViewChild('waveform') waveform: ElementRef;
  @ViewChild('progress') progress: ElementRef;
  @ViewChild('playBtn') playBtn: ElementRef;
  @ViewChild('pauseBtn') pauseBtn: ElementRef;
  @ViewChild('prevBtn') prevBtn: ElementRef;
  @ViewChild('nextBtn') nextBtn: ElementRef;
  @ViewChild('volumeBtn') volumeBtn: ElementRef;
  @ViewChild('volume') volume: ElementRef;
  @ViewChild('sliderBtn') sliderBtn: ElementRef;
  @ViewChild('bar') bar: ElementRef;
  @ViewChild('barEmpty') barEmpty: ElementRef;
  @ViewChild('barFull') barFull: ElementRef;
  @ViewChild('loading') loading: ElementRef;

  constructor() {}

  ngOnInit() {
    this.volumeBtn.nativeElement.addEventListener('click', () => {
      this.toggleVolume();
    });

    this.volume.nativeElement.addEventListener('click', () => {
      this.toggleVolume();
    });

    // Setup the event listeners to enable dragging of volume slider.
    this.barEmpty.nativeElement.addEventListener('click', (event) => {
      const per = event.layerX / parseFloat(this.barEmpty.nativeElement.scrollWidth);
      this.changeVolume(per);
    });
    this.sliderBtn.nativeElement.addEventListener('mousedown', () => {
      this.sliderDown = true;
    });
    this.sliderBtn.nativeElement.addEventListener('touchstart', () => {
      this.sliderDown = true;
    });
    this.volume.nativeElement.addEventListener('mouseup', () => {
      this.sliderDown = false;
    });
    this.volume.nativeElement.addEventListener('touchend', () => {
      this.sliderDown = false;
    });

    this.volume.nativeElement.addEventListener('mousemove', this.move.bind(this));
    this.volume.nativeElement.addEventListener('touchmove', this.move.bind(this));

    this.waveform.nativeElement.addEventListener('click', (event) => {
      const x = event.clientX || event.touches[0].clientX,
      layerX = x - this.view.nativeElement.getBoundingClientRect().left,
      second = (layerX / parseFloat(this.view.nativeElement.clientWidth)) * this.sound._duration;

      this.sound.seek(second);
      this.saveSeek = second;
    });

    this.keyboardSubscription = fromEvent(document, 'keydown').subscribe(
      (e: KeyboardEvent) => {
        switch (e.keyCode) {
          case 32:
            if (this.sound.playing()) {
              this.pause();
            } else {
              this.play();
            }
            break;
        }
      },
      error => console.log(error)
    );
  }

  ngOnChanges() {
    if (this.src && !this.sound) {
      this.setTrack();
    } else if (this.sound) {
      this.sound.stop();
      this.setTrack();
    }
  }

  setTrack() {
    this.sound = new Howl({
      src: [this.src],
      format: ['mp3'],
      onplay: () => {
        // Display the duration.
        this.duration = this.formatTime(Math.round(this.sound._duration));

        // Start updating the progress of the track.
        requestAnimationFrame(this.step.bind(this));

        // Start the wave animation if we have already loaded
        // wave.container.style.display = 'block';
        // this.bar.nativeElement.style.display = 'none';
        this.playBtn.nativeElement.style.display = 'none';
        this.pauseBtn.nativeElement.style.display = 'block';
      },
      onload: () => {
        // Start the wave animation.
        // wave.container.style.display = 'block';
        // this.bar.nativeElement.style.display = 'none';
        this.loading.nativeElement.style.display = 'none';
      },
      onend: () => {
        // Stop the wave animation.
        // wave.container.style.display = 'none';
        // this.bar.nativeElement.style.display = 'block';
        // this.skip('next');
      },
      onpause: () => {
        // Stop the wave animation.
        // wave.container.style.display = 'none';
        // this.bar.nativeElement.style.display = 'block';
      },
      onstop: () => {
        // Stop the wave animation.
        // wave.container.style.display = 'none';
        // this.bar.nativeElement.style.display = 'block';
      },
      onseek: () => {
        // Start upating the progress of the track.
        requestAnimationFrame(this.step.bind(this));
      }
    });

    this.sound.play();

    const analyser = Howler.ctx.createAnalyser();

    // Connect master gain to analyzer
    Howler.masterGain.connect(analyser);

    // Connect analyzer to destination
    analyser.connect(Howler.ctx.destination);

    // Creating output array (according to documentation https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API)
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount,
    dataArray = new Uint8Array(bufferLength);

    // Get the Data array
    analyser.getByteTimeDomainData(dataArray);

    // Display array
    setInterval(() => {
      analyser.getByteTimeDomainData(dataArray);
      console.dir(dataArray);
    }, 3000);
  }

  formatTime(secs: number): string {
    const minutes = Math.floor(secs / 60) || 0,
    seconds = (secs - minutes * 60) || 0;

    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
  }

  play(): void {
    if (this.sound) {
      // Resume the sound.
      this.sound.play();
      this.sound.seek(this.saveSeek);

      // Show the play button.
      this.playBtn.nativeElement.style.display = 'none';
      this.pauseBtn.nativeElement.style.display = 'block';
    }
  }

  pause(): void {
    if (this.sound) {
      // Pause the sound.
      this.saveSeek = this.sound.seek() || 0;
      this.sound.pause();

      // Show the pause button.
      this.playBtn.nativeElement.style.display = 'block';
      this.pauseBtn.nativeElement.style.display = 'none';
    }
  }

  step() {
    const seek = this.sound.seek() || 0;

    this.timer = this.formatTime(Math.round(seek));
    this.progress.nativeElement.style.width = `${(((seek / this.sound._duration) * 100) || 0)}%`;

    // If the sound is still playing, continue stepping.
    if (this.sound.playing()) {
      requestAnimationFrame(this.step.bind(this));
    }
  }

  toggleVolume() {
    const display = (this.volume.nativeElement.style.display === 'block') ? 'none' : 'block';

    setTimeout(() => {
      this.volume.nativeElement.style.display = display;
    }, (display === 'block') ? 0 : 500);

    this.volume.nativeElement.className = (display === 'block') ? 'fadein' : 'fadeout';
  }

  move(event) {
    if (this.sliderDown) {
      const x = event.clientX || event.touches[0].clientX,
      layerX = x - this.view.nativeElement.getBoundingClientRect().left,
      per = Math.min(1, Math.max(0, layerX / parseFloat(this.barEmpty.nativeElement.scrollWidth)));

      this.changeVolume(per);
    }
  }

  changeVolume(val) {
    // Update the global volume (affecting all Howls).
    Howler.volume(val);

    // Update the display on the slider.
    const barWidth = (val * 90) / 100,
    sliderBtnOffset = this.view.nativeElement.clientWidth * barWidth + this.view.nativeElement.clientWidth * 0.05 + 25;

    this.barFull.nativeElement.style.width = `${(barWidth * 100)}%`;
    this.sliderBtn.nativeElement.style.left = `${sliderBtnOffset}px`;
  }

  ngOnDestroy() {
    // this.sound.stop();
    this.keyboardSubscription.unsubscribe();
  }
}
