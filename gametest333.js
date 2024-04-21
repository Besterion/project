// Оголошення масиву об'єктів з індексами шестикутників та шляхами до зображень
const imagesToAdd = [
    { indexes: [106, 364, 616, 402, 150, 660], imagePath: 'Miner.png' },
    { indexes: [110, 368, 620, 146, 398, 656], imagePath: 'stoneCastle.png' },
    { indexes: [65, 677, 272, 476, 701, 89, 290, 494], imagePath: 'village.png' },
    { indexes: [121, 227, 533, 631, 233, 539, 135, 645], imagePath: 'woodenFort.png' },
    { indexes: [358, 408], imagePath: 'ratuhsa.png' },

];

// Клас, що малює шестикутники на полотні
class HexagonDrawer {
    constructor(canvasId, hexagonRadius, numRows, numCols, startX, startY) {
        this.canvas = document.getElementById(canvasId); // Отримуємо полотно за ID
        this.ctx = this.canvas.getContext("2d"); // Отримуємо контекст малювання
        this.canvas.width = startX + numCols * 1.5 * hexagonRadius; // Встановлюємо ширину полотна
        this.canvas.height = startY + numRows * hexagonRadius * Math.sqrt(3); // Встановлюємо висоту полотна
        this.hexagonRadius = hexagonRadius; // Радіус шестикутника
        this.hexagonWidth = hexagonRadius * 2; // Ширина шестикутника
        this.hexagonHeight = Math.sqrt(3) * hexagonRadius; // Висота шестикутника
        this.numRows = numRows; // Кількість рядків шестикутників
        this.numCols = numCols; // Кількість стовпців шестикутників
        this.startX = startX; // Початкова координата X
        this.startY = startY; // Початкова координата Y
        this.hexagons = []; // Масив для зберігання шестикутників
        this.setupHexagons(); // Ініціалізуємо розміщення шестикутників
    }

    drawLabeledHexagon(x, y, label) {// Метод для малювання підписаного шестикутника
        this.ctx.beginPath(); // Починаємо новий шлях
        for (let i = 0; i < 6; i++) { // Перебираємо кожну вершину шестикутника
            const rotation = (Math.PI / 3) * i; // Розраховуємо кут повороту для кожної вершини
            if (i === 0) {
                this.ctx.moveTo(this.hexagonRadius * Math.cos(rotation) + x, this.hexagonRadius * Math.sin(rotation) + y); // Переміщуємо каретку до першої вершини
            } else {
                this.ctx.lineTo(this.hexagonRadius * Math.cos(rotation) + x, this.hexagonRadius * Math.sin(rotation) + y); // З'єднуємо вершини лініями
            }
        }
        this.ctx.closePath(); // Замикання шляху
        this.ctx.stroke(); // Обводимо контур шестикутника
        this.ctx.fillText(label, x, y); // Додаємо підпис
    }


    setupHexagons() {// Метод для ініціалізації розміщення шестикутників
        for (let row = 0; row < this.numRows; row++) { // Перебираємо рядки
            this.hexagons.push([]); // Додаємо новий рядок до масиву шестикутників
            for (let col = 0; col < this.numCols; col++) { // Перебираємо стовпці
                const x = this.startX + col * (this.hexagonWidth * 0.75); // Розраховуємо координату X для поточного шестикутника
                let y = this.startY + row * this.hexagonHeight; // Розраховуємо координату Y для поточного шестикутника
                if (col % 2 === 1) { // Коригуємо координату Y для парних стовпців
                    y += this.hexagonHeight / 2;
                }
                const label = `${row * this.numCols + col + 1}`; // Генеруємо підпис для поточного шестикутника
                this.drawLabeledHexagon(x, y, label); // Малюємо шестикутник з підписом
                this.hexagons[row].push({ x, y, label }); // Додаємо шестикутник до масиву
            }
        }
    }

    placeImageInCell(cellNumber, imagePath) { // Метод для розміщення зображення в комірці
        const image = new Image(); // Створюємо новий об'єкт зображення
        image.onload = () => { // При завантаженні зображення
            const targetRow = Math.floor((cellNumber - 1) / this.numCols); // Рядок комірки
            const targetCol = (cellNumber - 1) % this.numCols; // Стовпець комірки
            const targetX = this.startX + targetCol * (this.hexagonWidth * 0.75); // Координата X для цільової комірки
            let targetY = this.startY + targetRow * this.hexagonHeight; // Координата Y для цільової комірки
            if (targetCol % 2 === 1) { // Коригуємо координату Y для парних стовпців
                targetY += this.hexagonHeight / 2;
            }
            const newWidth = this.hexagonWidth * 0.72; // Нова ширина зображення
            const newHeight = this.hexagonHeight * 0.72; // Нова висота зображення
            this.ctx.drawImage(image, targetX - newWidth / 2, targetY - newHeight / 2, newWidth, newHeight); // Малюємо зображення в комірці
        };
        image.src = imagePath; // Встановлюємо шлях до зображення
    }
}
const hexagonDrawer = new HexagonDrawer("canvas", 32, 15, 51, 50, 50);

// Завантажуємо зображення у відповідні комірки
imagesToAdd.forEach(({ indexes, imagePath }) => {
    indexes.forEach(index => {
        hexagonDrawer.placeImageInCell(index, imagePath);
    });
});


function createPopupButton(text, logicFunction) {//функція яку викликаємо в методі showPopup для відображення кнопок
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('popup-button');
    button.addEventListener('click', logicFunction);
    return button;
}

// Клас, що обробляє кліки на шестикутниках
class PopupHandler {
    constructor(hexagonDrawer, imagesToAdd) {
        this.hexagonDrawer = hexagonDrawer; // Посилання на об'єкт HexagonDrawer
        this.imagesToAdd = imagesToAdd; // Масив об'єктів з індексами шестикутників та шляхами до зображень
        this.popupOpen = false; // Прапорець, що показує, чи відкритий попап
        //this.setupClickListener(); // Ініціалізуємо обробник кліків
    }

    setupClickListener(subarray, textImage, buttonInfo) {
        const self = this;
        this.hexagonDrawer.canvas.addEventListener("click", function (event) {
            self.onClick(event, subarray, textImage, buttonInfo);
        });
    }

    // Метод для показу попапу з інформацією про клікнутий шестикутник
    showPopup(x, y, textImage, buttonInfo) {
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.style.left = x + 'px';
        popup.style.top = (y - 170) + 'px';
    
        const popupHeight = 210;
        const popupTop = y - popupHeight;
    
        if (popupTop < 0) {
            popup.style.top = y + 'px';
        } else {
            popup.style.top = popupTop + 'px';
        }
    
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.classList.add('close-button');
        closeButton.addEventListener('click', () => {
            popup.remove();
            this.popupOpen = false;
        });
    
        // Створюємо окремий контейнер для тексту та кнопок
        const contentContainer = document.createElement('div');
        contentContainer.classList.add('content-container');
    
        // Створюємо окремий елемент для тексту
        const textContent = document.createElement('div');
        textContent.textContent = textImage;
        textContent.classList.add('text-content');
    
        // Створюємо окремий контейнер для кнопок
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
    
        // Генеруємо кнопки
        buttonInfo.forEach(info => {
            const button = createPopupButton(info.text, info.logic);
            buttonContainer.appendChild(button);
        });
    
        // Додаємо елементи до контейнера з контентом
        contentContainer.appendChild(closeButton);
        contentContainer.appendChild(textContent);
        contentContainer.appendChild(buttonContainer);
    
        popup.appendChild(contentContainer); // Додаємо контейнер з контентом до вікна popup
    
        document.body.appendChild(popup);
    }

    // Метод для обробки кліків на полотні
    onClick(event, subarray, textImage, buttonInfo) {
        if (!this.popupOpen) {
            const clickX = event.clientX - this.hexagonDrawer.canvas.getBoundingClientRect().left;
            const clickY = event.clientY - this.hexagonDrawer.canvas.getBoundingClientRect().top;
            this.hexagonDrawer.hexagons.forEach(row => {
                row.forEach(hexagon => {
                    const { x, y, label } = hexagon;
                    if (clickX > x - this.hexagonDrawer.hexagonRadius && clickX < x + this.hexagonDrawer.hexagonRadius &&
                        clickY > y - this.hexagonDrawer.hexagonRadius && clickY < y + this.hexagonDrawer.hexagonRadius) {
                        const index = parseInt(label);
                        if (subarray.includes(index)) {
                            this.showPopup(x, y, textImage, buttonInfo); // Передача textImage в showPopup
                            this.popupOpen = true;
                        }
                    }
                });
            });
        }
    }

    containsIndex(index, subarray) {// маленький метод в методі щоб повертав тру чи фолс(служить для індексів підмасиву з індексів картнок в комірках)
        return subarray.includes(index);
    }
}

// Створюємо екземпляр PopupHandler для обробки кліків на шестикутниках
const popupHandler = new PopupHandler(hexagonDrawer, imagesToAdd);

function toCountGoldProtect(goldTurn, protection, increaseInGold, increaseInProtection) {
    goldTurn *= increaseInGold;
    protection *= increaseInProtection;
    return { goldTurn, protection };
}

class ResourceStats {
    constructor(goldTurn, protection) {
        this.goldTurn = goldTurn;
        this.protection = protection;
    }

}

const resourceStats = new ResourceStats(80, 10);
console.log(resourceStats)
class GoldPit extends PopupHandler {
    constructor(hexagonDrawer, imagesToAdd, resourceStats) {
        super(hexagonDrawer, imagesToAdd);
        const minerIndexes = imagesToAdd[0].indexes;
        this.goldTurn = resourceStats.goldTurn;
        this.protection = resourceStats.protection;
        this.textImage = `Goldpit ${this.goldTurn}g ${this.protection}p`;

        this.buttonInfo = [
            {
                text: 'Додаткові працівники',
                logic: () => {
                    const { goldTurn, protection } = toCountGoldProtect(this.goldTurn, this.protection, 1.25, 1.10);
                    this.goldTurn = Number(goldTurn.toFixed(1));
                    this.protection = Number(protection.toFixed(1));

                    const textContentElement = document.querySelector('.text-content');
                    textContentElement.textContent = `Goldpit ${this.goldTurn}g ${this.protection}p`;
                }
            },
            {
                text: 'Покращення обладнання', logic: () => { }
            },
            {
                text: 'Додаткове обладнення', logic: () => { }
            }
        ];

        this.setupClickListener(minerIndexes, this.textImage, this.buttonInfo);
    }
}

const goldPit = new GoldPit(hexagonDrawer, imagesToAdd, resourceStats);
console.log(resourceStats)
console.log(goldPit)

class Castle extends PopupHandler {
    constructor(hexagonDrawer, imagesToAdd) {
        super(hexagonDrawer, imagesToAdd);
        const minerIndexes = imagesToAdd[1].indexes;
        this.textImage = 'Castle';

        this.buttonInfo = [
            {
                text: 'Додаткові Вежі', logic: () => { }
            },
            {
                text: 'Покращення рову', logic: () => { }
            },
            {
                text: 'Покращення стін', logic: () => { }
            }
        ];

        this.setupClickListener(minerIndexes, this.textImage, this.buttonInfo);
    }
}

const castle = new Castle(hexagonDrawer, imagesToAdd);


class Village extends PopupHandler {
    constructor(hexagonDrawer, imagesToAdd) {
        super(hexagonDrawer, imagesToAdd);
        const minerIndexes = imagesToAdd[2].indexes;
        this.textImage = 'Village';

        this.buttonInfo = [
            {
                text: 'Up сількогосподарства', logic: () => { }
            },
            {
                text: 'Розширити базар', logic: () => { }
            },
            {
                text: 'Захисні споруди', logic: () => { }
            }
        ];

        this.setupClickListener(minerIndexes, this.textImage, this.buttonInfo);
    }
}

const village = new Village(hexagonDrawer, imagesToAdd);


class Bulwark extends PopupHandler {
    constructor(hexagonDrawer, imagesToAdd) {
        super(hexagonDrawer, imagesToAdd);
        const minerIndexes = imagesToAdd[3].indexes;
        this.textImage = 'Bulwark';

        this.buttonInfo = [
            {
                text: 'Додаткові патрулі', logic: () => { }
            },
            {
                text: 'Покращення стін', logic: () => { }
            },
            {
                text: 'Покращити оборонні рови', logic: () => { }
            }
        ];

        this.setupClickListener(minerIndexes, this.textImage, this.buttonInfo);
    }
}

const bulwark = new Bulwark(hexagonDrawer, imagesToAdd);

class TownHall extends PopupHandler {
    constructor(hexagonDrawer, imagesToAdd) {
        super(hexagonDrawer, imagesToAdd);
        const minerIndexes = imagesToAdd[4].indexes;
        this.textImage = 'Town hall';
        this.buttonInfo = [
            {
                text: 'Покращити промисловість', logic: () => { }
            },
            {
                text: 'Найм додаткових управлінців', logic: () => { }
            },
            {
                text: 'Додати оборонні споруди', logic: () => { }
            }
        ];

        this.setupClickListener(minerIndexes, this.textImage, this.buttonInfo);
    }
}

const townHall = new TownHall(hexagonDrawer, imagesToAdd);

