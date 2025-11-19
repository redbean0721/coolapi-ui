<template>
    <div class="header">
		<div class="left">
			<h1>Image To PDF</h1>
			<ul class="breadcrumb">
				<li><a href="#">CoolAPI</a></li>
				/
				<li><a href="#" class="active">Image To PDF</a></li>
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
				<button @click="clearAll" class="btn-clear">
					<i class="bx bx-trash"></i> 清除全部
				</button>
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
					@click="convertToPDF" 
					class="btn-convert"
					:disabled="isConverting"
				>
					<i class="bx bx-loader-alt" v-if="isConverting"></i>
					<i class="bx bx-file-blank" v-else></i>
					{{ isConverting ? "轉換中..." : "轉換為 PDF" }}
				</button>
			</div>
		</div>

		<!-- 下載區域 -->
		<div v-if="pdfUrl" class="download-area">
			<div class="success-message">
				<i class="bx bx-check-circle"></i>
				<h3>PDF 轉換成功!</h3>
				<p>您的 PDF 檔案已準備好下載</p>
			</div>
			<button @click="downloadPDF" class="btn-download">
				<i class="bx bx-download"></i> 下載 PDF
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

// IndexedDB 操作
const DB_NAME = "img2pdf_db";
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
		const isConverting = ref(false);
		const pdfUrl = ref(null);
		const dragIndex = ref(null);
		const previewIndex = ref(null);

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
			pdfUrl.value = null;
			clearDB();
		};

		const convertToPDF = async () => {
			isConverting.value = true;
			try {
				// 這裡應該調用你的 API 來轉換圖片為 PDF
				// 示例代碼 - 實際實現時需要連接到你的後端 API
				
				const formData = new FormData();
				images.value.forEach((image, index) => {
					formData.append("images", image.file);
				});

				// 模擬 API 調用
				// const response = await fetch("/api/convert/img2pdf", {
				// 	method: "POST",
				// 	body: formData
				// });
				// const blob = await response.blob();
				// pdfUrl.value = URL.createObjectURL(blob);

				// 暫時使用模擬延遲
				await new Promise(resolve => setTimeout(resolve, 2000));
				
				// 這裡需要實際的 API 調用
				console.log("準備轉換的圖片:", images.value);
				alert("請在這裡實現實際的 API 調用來轉換圖片為 PDF");
			} catch (error) {
				console.error("轉換失敗:", error);
				alert("轉換失敗，請重試");
			} finally {
				isConverting.value = false;
			}
		};

		const downloadPDF = () => {
			if (pdfUrl.value) {
				const link = document.createElement("a");
				link.href = pdfUrl.value;
				link.download = `images_to_pdf_${Date.now()}.pdf`;
				link.click();
			}
		};

		const resetAll = () => {
			images.value = [];
			pdfUrl.value = null;
			isConverting.value = false;
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
			isConverting,
			pdfUrl,
			dragIndex,
			triggerFileInput,
			handleFileSelect,
			handleDrop,
			removeImage,
			clearAll,
			convertToPDF,
			downloadPDF,
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

.preview-header h3 {
	color: var(--dark);
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