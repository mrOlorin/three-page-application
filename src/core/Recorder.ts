import * as JSZip from "jszip";
import {saveAs} from "file-saver";
import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";

type RecordSettings = {
    canvas: HTMLCanvasElement,
    framesCount: number,
    quality?: number
    jZipFileOptions?: JSZip.JSZipFileOptions,
}

export type State = 'idle' | 'loading' | 'recording' | 'converting' | 'building' | 'downloading';

export default class Recorder {

    public static progress: number = 0;
    public static state: State = 'idle';

    public static async recordFF(settings: RecordSettings) {
        const stateCount = 6;
        const fileName = 'record.webm';

        if (Recorder.progress > 0) {
            throw new Error('Record already in progress');
        }
        if (!settings.quality) {
            settings.quality = 0.92;
        }
        Recorder.state = 'loading';
        const ffmpeg = createFFmpeg({
            log: true,
            progress: progressParams => Recorder.progress += progressParams.ratio / stateCount,
        });
        await ffmpeg.load();
        Recorder.state = 'recording';
        let i = 0;
        const loop = async () => {
            const path = `frame-${i.toString(10).padStart(4, '0')}.png`;
            const screenshot = Recorder.takeScreenshot(settings.canvas, settings.quality);
            ffmpeg.FS('writeFile', path, await fetchFile(screenshot));

            if (i++ > settings.framesCount) {
                Recorder.state = 'converting';
                Recorder.progress += .5 / stateCount;
                await ffmpeg.run('-framerate', '60', '-i', 'frame-%04d.png', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '0', '-pass', '1', '-an', '-f', 'webm', 'NULL');
                Recorder.progress += .5 / stateCount;
                await ffmpeg.run('-framerate', '60', '-i', 'frame-%04d.png', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '23', '-pass', '2', '-c:a', 'libopus', 'record.webm');
                Recorder.state = 'building';
                Recorder.progress += .5 / stateCount;
                const blob = new Blob([ffmpeg.FS('readFile', fileName)], {type: "image/jpeg"});
                Recorder.state = 'downloading';
                saveAs(blob, 'record.webm');
                Recorder.progress = 1;
                Recorder.state = 'idle';
                return;
            }
            Recorder.progress = i / settings.framesCount / stateCount;
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }

    public static async recordCanvas(settings: RecordSettings): Promise<void> {
        if (Recorder.progress > 0) {
            throw new Error('Record already in progress');
        }
        if (!settings.quality) {
            settings.quality = 0.92;
        }
        if (!settings.jZipFileOptions) {
            settings.jZipFileOptions = {base64: true, binary: true};
        }

        const batFile = {
            name: '_towebm.bat',
            lines: [
                'ffmpeg -framerate 60 -i frame-%%04d.png -c:v libvpx-vp9 -b:v 0 -crf 0 -pass 1 -an -f webm NULL',
                'ffmpeg -framerate 60 -i frame-%%04d.png -c:v libvpx-vp9 -b:v 0 -crf 23 -pass 2 -c:a libopus _result.webm',
            ]
        };
        const zip = new JSZip();
        zip.file(batFile.name, batFile.lines.join("\n"));
        let i = 0;
        const loop = async (time: number) => {
            Recorder.progress = i / settings.framesCount;
            const path = `frame-${i.toString(10).padStart(4, '0')}.png`;
            const screenshot = Recorder.takeScreenshot(settings.canvas, settings.quality);
            zip.file(path, screenshot, settings.jZipFileOptions);
            if (i++ >= settings.framesCount) {
                console.warn('Снято!');
                console.info('Архивация...');
                const content = await zip.generateAsync(
                    {type: 'blob'},
                    metadata => Recorder.progress = 1 + metadata.percent * 0.01,
                );
                console.info('Скачивание...');
                saveAs(content, 'frames.zip');
                Recorder.progress = 0;
                //console.log(screenshot);
                return;
            }
            requestAnimationFrame(loop);
        }
        loop(0);
    }

    public static takeScreenshot(canvas: HTMLCanvasElement, quality: number) {
        return canvas.toDataURL('image/png', quality);
        //.replace(/^data:image\/(png|jpg);base64,/, "");
    }

}


