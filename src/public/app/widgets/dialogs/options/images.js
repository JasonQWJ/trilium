import OptionsTab from "./options_tab.js";

const TPL = `
<div class="options-section">
    <h4>Images</h4>
    
    <div class="form-group">
        <input id="download-images-automatically" type="checkbox" name="download-images-automatically">
        <label for="download-images-automatically">Download images automatically for offline use.</label>
        <p>(pasted HTML can contain references to online images, Trilium will find those references and download the images so that they are available offline)</p>
    </div>
    
    <div class="form-group">
        <input id="image-compresion-enabled" type="checkbox" name="image-compression-enabled">
        <label for="image-compresion-enabled">Enable image compression</label>
    </div>

    <div id="image-compression-enabled-wraper">
        <div class="form-group">
            <label for="image-max-width-height">Max width / height of an image in pixels (image will be resized if it exceeds this setting).</label>
            <input class="form-control" id="image-max-width-height" type="number" min="1">
        </div>
    
        <div class="form-group">
            <label for="image-jpeg-quality">JPEG quality (10 - worst quality, 100 best quality, 50 - 85 is recommended)</label>
            <input class="form-control" id="image-jpeg-quality" min="10" max="100" type="number">
        </div>
    </div>
</div>
`;

export default class ImageOptions extends OptionsTab {
    get tabTitle() { return "Images" }

    lazyRender() {
        this.$widget = $(TPL);

        this.$imageMaxWidthHeight = this.$widget.find("#image-max-width-height");
        this.$imageJpegQuality = this.$widget.find("#image-jpeg-quality");

        this.$imageMaxWidthHeight.on('change', () => {
            this.updateOption('imageMaxWidthHeight', this.$imageMaxWidthHeight.val());
        });

        this.$imageJpegQuality.on('change', () => {
            this.updateOption('imageJpegQuality', this.$imageJpegQuality.val());
        });

        this.$downloadImagesAutomatically = this.$widget.find("#download-images-automatically");

        this.$downloadImagesAutomatically.on("change", () => {
            const isChecked = this.$downloadImagesAutomatically.prop("checked");
            this.updateOption('downloadImagesAutomatically', isChecked ? 'true' : 'false');
        });

        this.$enableImageCompression = this.$widget.find("#image-compresion-enabled");
        this.$imageCompressionWrapper = this.$widget.find("#image-compression-enabled-wraper");

        this.$enableImageCompression.on("change", () => {
            const isChecked = this.$enableImageCompression.prop("checked");
            this.updateOption('compressImages', isChecked ? 'true' : 'false');

            this.setImageCompression(isChecked);
        });
    }

    setImageCompression(isChecked) {
        if (isChecked) {
            this.$imageCompressionWrapper.removeClass("disabled-field");
        } else {
            this.$imageCompressionWrapper.addClass("disabled-field");
        }
    }

    optionsLoaded(options) {
        this.$imageMaxWidthHeight.val(options['imageMaxWidthHeight']);
        this.$imageJpegQuality.val(options['imageJpegQuality']);

        const downloadImagesAutomatically = options['downloadImagesAutomatically'] === 'true';
        this.$downloadImagesAutomatically.prop('checked', downloadImagesAutomatically);

        const compressImages = options['compressImages'] === 'true';
        this.$enableImageCompression.prop('checked', compressImages);
        this.setImageCompression(compressImages);
    }
}