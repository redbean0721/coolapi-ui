<template>
    <div class="header">
		<div class="left">
			<h1>Image Tools</h1>
			<ul class="breadcrumb">
				<li><a href="#">CoolAPI</a></li>
				/
				<li><a href="#" class="active">Image Tools</a></li>
			</ul>
		</div>
    </div>

	<!-- 主要內容區域 -->
	<div class="img2pdf-container">
		<!-- 上傳區域 -->
		<div 
			class="upload-area"
			:class="{ 'drag-over': isDragging }"
			@drop.prevent="handleDrop"
			@dragover.prevent="isDragging = true"
			@dragleave.prevent="isDragging = false"
			@click="triggerFileInput"
		>
			<i class="bx bx-cloud-upload"></i>
			<h3>拖放圖片到這裡</h3>
			<p>或點擊選擇圖片</p>
			<p class="hint">支援 JPG, PNG, GIF 格式 (可選擇多張)</p>
			<input 
				ref="fileInput"
				type="file" 
				accept="image/*" 
				multiple
				@change="handleFileSelect"
				style="display: none;"
			>
		</div>

		<!-- 圖片預覽區域 -->
		<div v-if="images.length > 0" class="preview-area">
			<div class="preview-header">
				<h3>已選擇 {{ images.length }} 張圖片</h3>
				<div class="header-actions">
					<div class="auto-clear-options">
						<label class="checkbox-label">
							<input type="checkbox" v-model="autoClearImages" />
							<span>處理後清除圖片</span>
						</label>
						<label class="checkbox-label">
							<input type="checkbox" v-model="autoClearResult" />
							<span>下載後自動清除</span>
						</label>
					</div>
					<button @click="clearAll" class="btn-clear">
						<i class="bx bx-trash"></i> 清除全部
					</button>
				</div>
			</div>

			<!-- 模式切換 TAB -->
			<div class="mode-tabs">
				<button 
					class="tab-btn" 
					:class="{ active: mode === 'compress' }"
					@click="mode = 'compress'"
				>
					<i class="bx bx-image"></i>
					壓縮圖片
				</button>
				<button 
					class="tab-btn" 
					:class="{ active: mode === 'pdf' }"
					@click="mode = 'pdf'"
				>
					<i class="bx bx-file-blank"></i>
					轉為 PDF
				</button>
				<button 
					class="tab-btn" 
					:class="{ active: mode === 'both' }"
					@click="mode = 'both'"
				>
					<i class="bx bx-layer"></i>
					壓縮後轉 PDF
				</button>
			</div>

			<!-- 配置區域 -->
			<div class="config-area">
				<!-- 壓縮設定 -->
				<div v-if="mode === 'compress' || mode === 'both'" class="config-section">
					<button class="config-toggle" :class="{ 'open': isCompressionConfigOpen }" @click="isCompressionConfigOpen = !isCompressionConfigOpen">
						<h4><i class="bx bx-slider"></i> 壓縮設定</h4>
						<i class="bx" :class="isCompressionConfigOpen ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
					</button>
					<div v-show="isCompressionConfigOpen" class="config-grid">
						<div class="config-item">
							<label>圖片品質：{{ Math.round(compressionOptions.quality * 100) }}%</label>
							<input 
								type="range" 
								v-model.number="compressionOptions.quality" 
								min="0.1" 
								max="1" 
								step="0.1"
								class="slider"
							>
							<span class="hint">品質越低，檔案越小</span>
						</div>
						<div class="config-item">
							<label>最大寬度：{{ compressionOptions.maxWidth }}px</label>
							<input 
								type="range" 
								v-model.number="compressionOptions.maxWidth" 
								min="480" 
								max="3840" 
								step="120"
								class="slider"
							>
						</div>
						<div class="config-item">
							<label>最大高度：{{ compressionOptions.maxHeight }}px</label>
							<input 
								type="range" 
								v-model.number="compressionOptions.maxHeight" 
								min="360" 
								max="2160" 
								step="120"
								class="slider"
							>
						</div>
					</div>
				</div>

				<!-- PDF 設定 -->
				<div v-if="mode === 'pdf' || mode === 'both'" class="config-section">
					<button class="config-toggle" :class="{ 'open': isPdfConfigOpen }" @click="isPdfConfigOpen = !isPdfConfigOpen">
						<h4><i class="bx bx-file"></i> PDF 設定</h4>
						<i class="bx" :class="isPdfConfigOpen ? 'bx-chevron-up' : 'bx-chevron-down'"></i>
					</button>
					<div v-show="isPdfConfigOpen" class="config-grid">
						<div class="config-item">
							<label>紙張尺寸</label>
							<select v-model="pdfOptions.format" class="select-input">
								<option value="a4">A4 (210 × 297 mm)</option>
								<option value="letter">Letter (216 × 279 mm)</option>
								<option value="a3">A3 (297 × 420 mm)</option>
							</select>
						</div>
						<div class="config-item">
							<label>頁面方向</label>
							<select v-model="pdfOptions.orientation" class="select-input">
								<option value="portrait">直向 (Portrait)</option>
								<option value="landscape">橫向 (Landscape)</option>
							</select>
						</div>
						<div class="config-item">
							<label>邊距：{{ pdfOptions.margin }}mm</label>
							<input 
								type="range" 
								v-model.number="pdfOptions.margin" 
								min="0" 
								max="30" 
								step="5"
								class="slider"
							>
						</div>
					</div>
				</div>
			</div>

			<!-- 圖片列表 -->
			<div class="image-list">
				<div 
					v-for="(image, index) in images" 
					:key="index"
					class="image-item"
					draggable="true"
					@dragstart="onDragStart(index)"
					@dragover.prevent="onDragOver(index)"
					@drop.prevent="onDrop(index)"
					:class="{ dragging: dragIndex === index }"
				>
					<img :src="image.preview" :alt="`圖片 ${index + 1}`" @click="openPreview(index)">
					<div class="image-overlay">
						<span class="image-number">{{ index + 1 }}</span>
						<button @click.stop="removeImage(index)" class="btn-remove">
							<i class="bx bx-x"></i>
						</button>
					</div>
					<p class="image-name">{{ image.file.name }}</p>
				</div>
			</div>

			<!-- 操作按鈕 -->
			<div class="action-buttons">
				<button 
					@click="processImages" 
					class="btn-convert"
					:disabled="isProcessing"
				>
					<i class="bx bx-loader-alt" v-if="isProcessing"></i>
					<i class="bx bx-image" v-else-if="mode === 'compress'"></i>
					<i class="bx bx-file-blank" v-else-if="mode === 'pdf'"></i>
					<i class="bx bx-layer" v-else></i>
					{{ getProcessButtonText() }}
				</button>
			</div>
		</div>

		<!-- 下載區域 -->
		<div v-if="resultUrl" class="download-area">
			<div class="success-message">
				<i class="bx bx-check-circle"></i>
				<h3>處理成功!</h3>
				<p v-if="mode === 'compress'">您的壓縮圖片已準備好下載 (ZIP 格式)</p>
				<p v-else-if="mode === 'pdf'">您的 PDF 檔案已準備好下載</p>
				<p v-else>您的壓縮版 PDF 檔案已準備好下載</p>
			</div>
			<button @click="downloadResult" class="btn-download">
				<i class="bx bx-download"></i> 下載 {{ mode === 'compress' ? 'ZIP' : 'PDF' }}
			</button>
			<button @click="resetAll" class="btn-secondary">
				<i class="bx bx-refresh"></i> 重新開始
			</button>
		</div>

		<!-- 圖片預覽模態框 -->
		<div v-if="previewIndex !== null" class="preview-modal" @click="closePreview">
			<div class="preview-content" @click.stop>
				<button class="close-btn" @click="closePreview">
					<i class="bx bx-x"></i>
				</button>
				
				<button v-if="images.length > 1" class="nav-btn prev-btn" @click="prevImage">
					<i class="bx bx-chevron-left"></i>
				</button>
				
				<div class="preview-image-container">
					<img :src="images[previewIndex].preview" :alt="`圖片 ${previewIndex + 1}`">
					<div class="preview-info">
						<p class="preview-number">{{ previewIndex + 1 }} / {{ images.length }}</p>
						<p class="preview-filename">{{ images[previewIndex].file.name }}</p>
					</div>
				</div>
				
				<button v-if="images.length > 1" class="nav-btn next-btn" @click="nextImage">
					<i class="bx bx-chevron-right"></i>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted } from "vue";
import jsPDF from "jspdf";
import imageCompression from "browser-image-compression";

// IndexedDB 操作
const DB_NAME = "img_tools_db";
const STORE_NAME = "images";
const DB_VERSION = 1;

function openDB() {
	return new Promise((resolve, reject) => {
		const request = window.indexedDB.open(DB_NAME, DB_VERSION);
		request.onupgradeneeded = function (event) {
			const db = event.target.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: "index" });
			}
		};
		request.onsuccess = function (event) {
			resolve(event.target.result);
		};
		request.onerror = function (event) {
			reject(event);
		};
	});
}

async function saveImagesToDB(images) {
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, "readwrite");
	const store = tx.objectStore(STORE_NAME);
	await store.clear();
	images.forEach((img, idx) => {
		store.put({
			index: idx,
			name: img.file.name,
			preview: img.preview,
			fileType: img.file.type
		});
	});
	return tx.complete;
}

async function loadImagesFromDB() {
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, "readonly");
	const store = tx.objectStore(STORE_NAME);
	return new Promise((resolve) => {
		const images = [];
		const req = store.openCursor();
		req.onsuccess = function (event) {
			const cursor = event.target.result;
			if (cursor) {
				images.push(cursor.value);
				cursor.continue();
			} else {
				// 按 index 排序
				images.sort((a, b) => a.index - b.index);
				resolve(images);
			}
		};
	});
}

async function clearDB() {
	const db = await openDB();
	const tx = db.transaction(STORE_NAME, "readwrite");
	const store = tx.objectStore(STORE_NAME);
	await store.clear();
	return tx.complete;
}

export default {
	setup() {
		const fileInput = ref(null);
		const images = ref([]);
		const isDragging = ref(false);
		const isProcessing = ref(false);
		const resultUrl = ref(null);
		const dragIndex = ref(null);
		const previewIndex = ref(null);
		const autoClearImages = ref(true);
		const autoClearResult = ref(true);
		
		// 模式：compress（壓縮圖片）、pdf（轉PDF）、both（壓縮後轉PDF）
		const mode = ref('compress');
		
		// 壓縮選項
		const compressionOptions = ref({
			quality: 0.8,
			maxWidth: 1920,
			maxHeight: 1080
		});
		
		// PDF 選項
		const pdfOptions = ref({
			format: 'a4',
			orientation: 'portrait',
			margin: 10
		});

		const isCompressionConfigOpen = ref(false);
		const isPdfConfigOpen = ref(false);

		// 載入 IndexedDB 資料
		const restoreImages = async () => {
			const dbImages = await loadImagesFromDB();
			images.value = dbImages.map(img => ({
				file: { name: img.name, type: img.fileType },
				preview: img.preview
			}));
		};

		onMounted(() => {
			restoreImages();
		});

		// 觸發文件選擇
		const triggerFileInput = () => {
			fileInput.value.click();
		};

		const handleFileSelect = (event) => {
			const files = Array.from(event.target.files);
			addImages(files);
			event.target.value = "";
		};

		const handleDrop = (event) => {
			isDragging.value = false;
			const files = Array.from(event.dataTransfer.files);
			const imageFiles = files.filter(file => file.type.startsWith("image/"));
			addImages(imageFiles);
		};

		const addImages = (files) => {
			let added = 0;
			files.forEach(file => {
				if (file.type.startsWith("image/")) {
					const reader = new FileReader();
					reader.onload = (e) => {
						images.value.push({
							file: file,
							preview: e.target.result
						});
						added++;
						if (added === files.length) {
							saveImagesToDB(images.value);
						}
					};
					reader.readAsDataURL(file);
				}
			});
		};

		const removeImage = (index) => {
			images.value.splice(index, 1);
			saveImagesToDB(images.value);
		};

		const clearAll = () => {
			images.value = [];
			resultUrl.value = null;
			clearDB();
		};

		// 取得處理按鈕文字
		const getProcessButtonText = () => {
			if (isProcessing.value) return '處理中...';
			if (mode.value === 'compress') return '壓縮圖片';
			if (mode.value === 'pdf') return '轉換為 PDF';
			return '壓縮後轉 PDF';
		};

		// 壓縮單張圖片
		const compressImage = async (file) => {
			const options = {
				maxSizeMB: 10,
				maxWidthOrHeight: Math.max(compressionOptions.value.maxWidth, compressionOptions.value.maxHeight),
				useWebWorker: true,
				initialQuality: compressionOptions.value.quality
			};
			
			try {
				const compressedFile = await imageCompression(file, options);
				return compressedFile;
			} catch (error) {
				console.error('壓縮圖片失敗:', error);
				throw error;
			}
		};

		// 主要處理函數
		const processImages = async () => {
			isProcessing.value = true;
			try {
				if (mode.value === 'compress') {
					await compressOnly();
				} else if (mode.value === 'pdf') {
					await convertToPDF(false);
				} else {
					await convertToPDF(true);
				}
			} catch (error) {
				console.error('處理失敗:', error);
				alert('處理失敗，請重試: ' + error.message);
			} finally {
				isProcessing.value = false;
			}
		};

		// 只壓縮圖片（輸出 ZIP）
		const compressOnly = async () => {
			try {
				const JSZip = (await import('jszip')).default;
				const zip = new JSZip();
				
				for (let i = 0; i < images.value.length; i++) {
					const image = images.value[i];
					const compressedFile = await compressImage(image.file);
					zip.file(`compressed_${i + 1}_${image.file.name}`, compressedFile);
				}
				
				const zipBlob = await zip.generateAsync({ type: 'blob' });
				resultUrl.value = URL.createObjectURL(zipBlob);
				
				if (autoClearImages.value) {
					await clearDB();
					images.value = [];
				}
			} catch (error) {
				if (error.message.includes('Cannot find module')) {
					alert('壓縮圖片功能需要先安裝 jszip:\n\nyarn add jszip\n\n安裝後重新載入頁面即可使用。');
				}
				throw error;
			}
		};

		// 轉換為 PDF（可選壓縮）
		const convertToPDF = async (shouldCompress = false) => {
			// 創建 PDF 文檔
			const pdf = new jsPDF({
				orientation: pdfOptions.value.orientation,
				unit: 'mm',
				format: pdfOptions.value.format
			});

			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();
			const margin = pdfOptions.value.margin;

			// 處理每張圖片
			for (let i = 0; i < images.value.length; i++) {
				const image = images.value[i];
				
				// 如果不是第一張圖片，添加新頁面
				if (i > 0) {
					pdf.addPage();
				}

				// 如果需要壓縮，先壓縮圖片
				let imageData = image.preview;
				if (shouldCompress) {
					const compressedFile = await compressImage(image.file);
					imageData = await new Promise((resolve) => {
						const reader = new FileReader();
						reader.onload = (e) => resolve(e.target.result);
						reader.readAsDataURL(compressedFile);
					});
				}

				// 創建臨時 Image 對象來獲取圖片尺寸
				const img = new Image();
				await new Promise((resolve, reject) => {
					img.onload = resolve;
					img.onerror = reject;
					img.src = imageData;
				});

				// 計算圖片在 PDF 中的尺寸（保持比例並適應頁面）
				const imgWidth = img.width;
				const imgHeight = img.height;
				const ratio = imgWidth / imgHeight;

				let pdfImgWidth = pageWidth - (margin * 2);
				let pdfImgHeight = pdfImgWidth / ratio;

				// 如果圖片高度超過頁面高度，重新計算
				if (pdfImgHeight > pageHeight - (margin * 2)) {
					pdfImgHeight = pageHeight - (margin * 2);
					pdfImgWidth = pdfImgHeight * ratio;
				}

				// 計算居中位置
				const x = (pageWidth - pdfImgWidth) / 2;
				const y = (pageHeight - pdfImgHeight) / 2;

				// 將圖片添加到 PDF
				pdf.addImage(imageData, 'JPEG', x, y, pdfImgWidth, pdfImgHeight);
			}

			// 生成 PDF Blob
			const pdfBlob = pdf.output('blob');
			resultUrl.value = URL.createObjectURL(pdfBlob);

			// 如果開啟「處理後清除圖片」選項
			if (autoClearImages.value) {
				await clearDB();
				images.value = [];
			}
		};

		const downloadResult = () => {
			if (resultUrl.value) {
				const link = document.createElement("a");
				link.href = resultUrl.value;
				
				const timestamp = Date.now();
				if (mode.value === 'compress') {
					link.download = `compressed_images_${timestamp}.zip`;
				} else {
					link.download = `images_${mode.value === 'both' ? 'compressed_' : ''}${timestamp}.pdf`;
				}
				
				link.click();

				// 如果開啟「下載後自動清除」選項
				if (autoClearResult.value) {
					URL.revokeObjectURL(resultUrl.value);
					resultUrl.value = null;
					isProcessing.value = false;
				}
			}
		};

		const resetAll = () => {
			images.value = [];
			resultUrl.value = null;
			isProcessing.value = false;
			clearDB();
		};

		const onDragStart = (index) => {
			dragIndex.value = index;
		};
		const onDragOver = (index) => {
			// 可視化效果可加 highlight
		};
		const onDrop = (dropIndex) => {
			if (dragIndex.value === null || dragIndex.value === dropIndex) {
				dragIndex.value = null;
				return;
			}
			const moved = images.value.splice(dragIndex.value, 1)[0];
			images.value.splice(dropIndex, 0, moved);
			dragIndex.value = null;
			saveImagesToDB(images.value);
		};

		// 圖片預覽功能
		const openPreview = (index) => {
			previewIndex.value = index;
		};

		const closePreview = () => {
			previewIndex.value = null;
		};

		const nextImage = () => {
			if (previewIndex.value < images.value.length - 1) {
				previewIndex.value++;
			} else {
				previewIndex.value = 0; // 循環到第一張
			}
		};

		const prevImage = () => {
			if (previewIndex.value > 0) {
				previewIndex.value--;
			} else {
				previewIndex.value = images.value.length - 1; // 循環到最後一張
			}
		};

		return {
			fileInput,
			images,
			isDragging,
			isProcessing,
			resultUrl,
			dragIndex,
			mode,
			compressionOptions,
			pdfOptions,
			isCompressionConfigOpen,
			isPdfConfigOpen,
			autoClearImages,
			autoClearResult,
			triggerFileInput,
			handleFileSelect,
			handleDrop,
			removeImage,
			clearAll,
			processImages,
			getProcessButtonText,
			downloadResult,
			resetAll,
			onDragStart,
			onDragOver,
			onDrop,
			previewIndex,
			openPreview,
			closePreview,
			nextImage,
			prevImage
		};
	},
	mounted() {
		document.title = `CoolAPI${this.$route.name ? ` - ${this.$route.name}` : ""}`;
	}
};
</script>

<style scoped>
.img2pdf-container {
	margin-top: 24px;
}

/* 上傳區域 */
.upload-area {
	border: 3px dashed var(--dark-grey);
	border-radius: 12px;
	padding: 60px 20px;
	text-align: center;
	cursor: pointer;
	transition: all 0.3s ease;
	background: var(--light);
}

.upload-area:hover,
.upload-area.drag-over {
	border-color: var(--primary);
	background: var(--grey);
}

.upload-area i {
	font-size: 64px;
	color: var(--primary);
	margin-bottom: 16px;
}

.upload-area h3 {
	font-size: 24px;
	margin-bottom: 8px;
	color: var(--dark);
}

.upload-area p {
	color: var(--dark-grey);
	margin-bottom: 4px;
}

.upload-area .hint {
	font-size: 20px;
	margin-top: 12px;
}

/* 預覽區域 */
.preview-area {
	margin-top: 32px;
}

.preview-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

/* 模式切換 TAB */
.mode-tabs {
	display: flex;
	gap: 12px;
	margin-bottom: 24px;
	background: var(--light);
	padding: 8px;
	border-radius: 12px;
}

.tab-btn {
	flex: 1;
	padding: 16px 24px;
	border: 2px solid transparent;
	border-radius: 8px;
	background: transparent;
	color: var(--dark-grey);
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
}

.tab-btn i {
	font-size: 20px;
}

.tab-btn:hover {
	background: var(--grey);
	color: var(--dark);
}

.tab-btn.active {
	background: var(--primary);
	color: white;
	border-color: var(--primary);
}

/* 配置區域 */
.config-area {
	margin-bottom: 24px;
}

.config-section {
	background: var(--light);
	padding: 24px;
	border-radius: 12px;
	margin-bottom: 16px;
}

.config-toggle {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: transparent;
	border: none;
	padding: 0;
	cursor: pointer;
}

.config-toggle.open {
	margin-bottom: 16px;
}

.config-toggle i.bx-chevron-up,
.config-toggle i.bx-chevron-down {
	font-size: 24px;
	color: var(--dark-grey);
}

.config-section h4 {
	color: var(--dark);
	margin-bottom: 0;
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 18px;
}

.config-section h4 i {
	font-size: 22px;
	color: var(--primary);
}

.config-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
}

.config-item {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.config-item label {
	font-weight: 600;
	color: var(--dark);
	font-size: 14px;
}

.config-item .hint {
	font-size: 12px;
	color: var(--dark-grey);
	margin-top: -4px;
}

.slider {
	width: 100%;
	height: 6px;
	border-radius: 3px;
	background: var(--grey);
	outline: none;
	appearance: none;
	-webkit-appearance: none;
	cursor: pointer;
}

.slider::-webkit-slider-thumb {
	appearance: none;
	-webkit-appearance: none;
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background: var(--primary);
	cursor: pointer;
	transition: all 0.3s ease;
}

.slider::-webkit-slider-thumb:hover {
	transform: scale(1.2);
	box-shadow: 0 0 8px var(--primary);
}

.slider::-moz-range-thumb {
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background: var(--primary);
	cursor: pointer;
	border: none;
	transition: all 0.3s ease;
}

.slider::-moz-range-thumb:hover {
	transform: scale(1.2);
	box-shadow: 0 0 8px var(--primary);
}

.select-input {
	padding: 12px 16px;
	border: 2px solid var(--grey);
	border-radius: 8px;
	background: var(--light);
	color: var(--dark);
	font-size: 14px;
	cursor: pointer;
	transition: all 0.3s ease;
}

.select-input option {
	background: var(--light);
	color: var(--dark);
}

.select-input:hover {
	border-color: var(--primary);
}

.select-input:focus {
	outline: none;
	border-color: var(--primary);
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.preview-header h3 {
	color: var(--dark);
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 16px;
}

.auto-clear-options {
	display: flex;
	gap: 12px;
	align-items: center;
}

.checkbox-label {
	display: flex;
	align-items: center;
	gap: 6px;
	cursor: pointer;
	padding: 8px 12px;
	background: var(--light);
	border-radius: 6px;
	transition: all 0.3s ease;
	user-select: none;
}

.checkbox-label:hover {
	background: var(--grey);
}

.checkbox-label input[type="checkbox"] {
	width: 18px;
	height: 18px;
	cursor: pointer;
	accent-color: var(--primary);
}

.checkbox-label span {
	font-size: 14px;
	color: var(--dark);
	white-space: nowrap;
}

.btn-clear {
	background: var(--danger);
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 8px;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 8px;
	transition: all 0.3s ease;
}

.btn-clear:hover {
	opacity: 0.9;
	transform: translateY(-2px);
}

/* 圖片列表 */
.image-list {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 20px;
	margin-bottom: 24px;
}

.image-item {
	position: relative;
	border-radius: 8px;
	overflow: hidden;
	background: var(--light);
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	transition: all 0.3s ease;
}

.image-item:hover {
	transform: translateY(-4px);
	box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.image-item img {
	width: 100%;
	height: 200px;
	object-fit: cover;
}

.image-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	padding: 8px;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
}

.image-number {
	background: var(--primary);
	color: white;
	padding: 4px 12px;
	border-radius: 12px;
	font-size: 14px;
	font-weight: bold;
}

.btn-remove {
	background: var(--danger);
	color: white;
	border: none;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.btn-remove:hover {
	transform: scale(1.1);
}

.btn-remove i {
	font-size: 20px;
}

.image-name {
	padding: 12px;
	font-size: 14px;
	color: var(--dark);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	margin: 0;
}

/* 操作按鈕 */
.action-buttons {
	display: flex;
	justify-content: center;
	gap: 16px;
}

.btn-convert {
	background: var(--primary);
	color: white;
	border: none;
	padding: 16px 48px;
	border-radius: 8px;
	font-size: 18px;
	font-weight: bold;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 12px;
	transition: all 0.3s ease;
}

.btn-convert:hover:not(:disabled) {
	opacity: 0.9;
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.btn-convert:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.btn-convert i.bx-loader-alt {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

/* 下載區域 */
.download-area {
	margin-top: 32px;
	text-align: center;
	background: var(--light);
	padding: 48px;
	border-radius: 12px;
}

.success-message {
	margin-bottom: 32px;
}

.success-message i {
	font-size: 64px;
	color: var(--success);
	margin-bottom: 16px;
}

.success-message h3 {
	font-size: 28px;
	color: var(--dark);
	margin-bottom: 8px;
}

.success-message p {
	color: var(--dark-grey);
	font-size: 16px;
}

.btn-download {
	background: var(--success);
	color: white;
	border: none;
	padding: 16px 48px;
	border-radius: 8px;
	font-size: 18px;
	font-weight: bold;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 12px;
	margin-right: 16px;
	transition: all 0.3s ease;
}

.btn-download:hover {
	opacity: 0.9;
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.btn-secondary {
	background: var(--dark-grey);
	color: white;
	border: none;
	padding: 16px 32px;
	border-radius: 8px;
	font-size: 18px;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 12px;
	transition: all 0.3s ease;
}

.btn-secondary:hover {
	opacity: 0.9;
	transform: translateY(-2px);
}

/* 響應式設計 */
@media (max-width: 1200px) {
	.image-list {
		grid-template-columns: repeat(4, 1fr);
	}
}

@media (max-width: 992px) {
	.image-list {
		grid-template-columns: repeat(3, 1fr);
	}
}

@media (max-width: 768px) {
	.image-list {
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}

	.upload-area {
		padding: 40px 20px;
	}

	.upload-area i {
		font-size: 48px;
	}

	.upload-area h3 {
		font-size: 20px;
	}

	.preview-header {
		flex-direction: column;
		gap: 12px;
		align-items: flex-start;
	}

	.header-actions {
		flex-direction: column;
		width: 100%;
		gap: 12px;
	}

	.auto-clear-options {
		width: 100%;
		flex-direction: column;
		gap: 8px;
	}

	.checkbox-label {
		width: 100%;
		justify-content: flex-start;
	}

	.btn-clear {
		width: 100%;
		justify-content: center;
	}

	.mode-tabs {
		flex-direction: column;
		gap: 8px;
	}

	.tab-btn {
		padding: 12px 16px;
		font-size: 14px;
	}

	.config-grid {
		grid-template-columns: 1fr;
	}

	.action-buttons {
		flex-direction: column;
	}

	.btn-convert,
	.btn-download,
	.btn-secondary {
		width: 100%;
		justify-content: center;
		margin: 0;
		margin-bottom: 12px;
	}
}

.image-item.dragging {
	opacity: 0.5;
	border: 2px dashed var(--primary);
}

.image-item img {
	cursor: pointer;
}

/* 圖片預覽模態框 */
.preview-modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.95);
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
	animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

.preview-content {
	position: relative;
	width: 90%;
	height: 90%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.preview-image-container {
	max-width: 100%;
	max-height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.preview-image-container img {
	max-width: 100%;
	max-height: calc(90vh - 100px);
	object-fit: contain;
	border-radius: 8px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.preview-info {
	margin-top: 20px;
	text-align: center;
	color: white;
}

.preview-number {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 8px;
}

.preview-filename {
	font-size: 16px;
	color: rgba(255, 255, 255, 0.8);
}

.close-btn {
	position: absolute;
	top: 20px;
	right: 20px;
	background: rgba(255, 255, 255, 0.2);
	color: white;
	border: none;
	width: 48px;
	height: 48px;
	border-radius: 50%;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	backdrop-filter: blur(10px);
}

.close-btn:hover {
	background: rgba(255, 255, 255, 0.3);
	transform: scale(1.1);
}

.close-btn i {
	font-size: 32px;
}

.nav-btn {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	background: rgba(255, 255, 255, 0.2);
	color: white;
	border: none;
	width: 56px;
	height: 56px;
	border-radius: 50%;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	backdrop-filter: blur(10px);
}

.nav-btn:hover {
	background: rgba(255, 255, 255, 0.3);
	transform: translateY(-50%) scale(1.1);
}

.nav-btn i {
	font-size: 36px;
}

.prev-btn {
	left: 20px;
}

.next-btn {
	right: 20px;
}

/* 鍵盤支援提示 */
@media (min-width: 769px) {
	.preview-modal {
		cursor: pointer;
	}
}
</style>