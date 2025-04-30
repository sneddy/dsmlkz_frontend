**DSML совместно с CPFed** организовали первую **Республиканскую AI-олимпиаду** для школьников. 

Олимпиада проходит в несколько этапов:
1. **Отборочный раунд** — комбинированный пул задач из спортивного программирования и машинного обучения.
2. **Homework Kaggle Competition** — настоящее Kaggle соревнование для 40 финалистов.
3. **Offline Final** — два тура, где участники за 2 дня решают 4 задачи в стиле Kaggle по ML, CV и NLP.

Со стороны Сообщества организацией занимались:
| Имя               | Описание                                                                 |
|-------------------|--------------------------------------------------------------------------|
| *Ален Баев*       | Организатор олимпиад по математике и спортивному программированию, призёр IMO, ML Engineer @ Higgsfield AI |
| *Ануар Аймолдин*  | DSML KZ Community Founder, Kaggle Top 14, призёр APMO                   |
| *Нурдаулет Аханов*| Призёр международных олимпиад по математике и информатике, SWE @ Google Taiwan |
| *Данил Орел*      | NLP ресерчер, KazNLP контрибьютор, студент MBZUAI                        |



# Результаты отборочного раунда AI-Олимпиады


## I. Победители (600+ баллов)

| Место | Имя                     | Школа                             |
|-------|--------------------------|------------------------------------|
| 1     | Бекетов Даужан           | Лицей №165 (Алматы)                |
| 2     | Агзам Шамсадинов         | РФМШ (Алматы)                      |
| 3     | Шерияздан Алихан         | НИШ (Павлодар)                     |

## II. 500+ баллов

| Имя               | Школа                             |
|-------------------|------------------------------------|
| Дулат Сәлімжан     | НИШ ФМБ (Шымкент)                  |
| Әлім Дәулетбек     | НИШ ФМН (Астана)                   |
| Арсен Ғалымжан     | НИШ ХБН (Петропавловск)            |
| Ахмет Сулейменов   | ОМПЛИ (Экибастуз)                  |

## III. 400+ баллов

| Имя                 | Школа                                      |
|---------------------|---------------------------------------------|
| Сұлтанби Исатай      | НИШ ХБН (Караганда)                         |
| Сұңғат Серікбай      | Білім-Инновация лицей (Тараз)              |
| Әбу Қанабек          | РФМШ (Алматы)                              |
| Жанибек Касымкан     | НИШ ФМН (Талдыкорган)                      |
| Арнелла Төлеген      | НИШ ХБН (Караганда)                        |
| Талим Аушахман       | РФМШ (Алматы)                              |
| Nurbatyr Tolegen     | НИШ (Петропавловск)                        |
| Batyr Yerdenov       | НИШ ХБН (Караганда)                        |
| Юсуф Ситдиков        | ОМПЛИ (Экибастуз)                          |
| Әлем Аменов          | Білім-Инновация лицей                      |
| Олжас Мусалимов      | НИШ ФМН                                    |

## Остальные Финалисты

| Имя                    | Школа                                      |
|------------------------|---------------------------------------------|
| Dauren Zhunussov       | NIS PHMD                                   |
| Nurmyrza Baizhanov     | Білім-Инновация лицей (Астана)             |
| Адиль Сейдазымов       | НИШ ФМН (Уральск)                          |
| Сұлтанбек Сары         | НИШ ХБН (Актау)                            |
| Ulugbek Osmanov        | НИШ ФМН (Тараз)                            |
| Еларыс Ертайұлы        | НИШ ФМН (Астана)                           |
| Arsen Kuan             | Білім-Инновация лицей                      |
| Timur Shakurov         | НСПМ                                       |
| Даулет Сабденов        | РФМШ (Алматы)                              |
| Әлемжан Ахметжанов     | НИШ ФМН (Семей)                            |
| Демеу Шерім            | Білім-Инновация лицей (Шымкент)           |
| Кирилл Богомазов       | Школа-лицей (Лисаковск)                    |
| Арсений Берестовой     | Школа-лицей (Лисаковск)                    |
| Yerassyl Abilkassym    | Haileybury (Алматы)                        |
| Камилла Исхакова       | Лицей №134                                 |
| Адилет Барат           | Кішішыған ОМ                               |
| Жарас Сейтенов         | Школа №10 ЖББОМ                            |
| Саят Токкулиев         | Школа №58                                  |
| Иномжон Тохтаров       | Школа №63 им. Қ. Сәтбаева                  |
| Арина Елетаева         | Гимназия им. А. Бөкейханова №1             |
| Осман Мальсагов        | Лицей №166                                 |
| Sultan Karilov         | Fiztex (Алматы)                            |
| Еркебулан Иманкулов    | ЖББ №1                                     |

# Решения задач отборочного этапа

## Задача A. Контрастные переходы

В Astana Hub пришёл новый стартап, который разрабатывает ИИ-модуль **NeuroScan** — передовую систему анализа активности головного мозга. Этот модуль сканирует последовательность сигналов от нейронов и ищет области с наибольшими резкими изменениями — так называемыми *контрастными переходами*. Эти зоны особенно важны для понимания когнитивных всплесков, памяти и обучения.

Каждое измерение — это уровень активации нейрона. NeuroScan должен определить, какой **непрерывный участок длиной $K$** демонстрирует **наибольшую сумму локальных контрастов** между соседними нейронами.

### Формальные определения
- Последовательность сигналов:  
  $$
  a_0,\ a_1,\ \dots,\ a_{N-1}
  $$

- Локальный контраст между двумя соседними нейронами:
  $$
  C_i = (a_i - a_{i+1})^2
  $$

- Суммарный локальный контраст подотрезка длины $K$:
  $$
  LC(i) = (a_i - a_{i+1})^2 + (a_{i+1} - a_{i+2})^2 + \dots + (a_{i+K-2} - a_{i+K-1})^2
  $$

---

### Цель

Найти максимальное значение $LC(i)$ среди всех подотрезков длины $K$:

$$
\max_{0 \le i \le N - K} LC(i)
$$

---

### Входные данные

На вход подаётся:

- Одно целое число $N$ — длина массива сигналов, где $2 \le N \le 10^5$  
- Одно целое число $K$ — длина подотрезка, где $2 \le K \le N$  
- $N$ целых чисел $a_0, a_1, \dots, a_{N-1}$ — уровни нейронной активации, где $-10^4 \le a_i \le 10^4$

---

### Выходные данные

Одно целое число — максимальный суммарный локальный контраст среди всех подотрезков длины $K$.

---

### 💡 Решение задачи: скользящие окна

#### 1. Обозначения

Пусть:

$$
d_i = (a_i - a_{i+1})^2, \quad i = 0, \dots, N-2
$$

Тогда сумма локальных контрастов окна $[l,\; l+K-1]$ равна:

$$
LC(l) = \sum_{j = l}^{l + K - 2} d_j
$$

Искомый ответ:

$$
\max_{0 \le l \le N-K} LC(l)
$$

То есть — максимум суммы $K - 1$ подряд идущих элементов массива $d$.

---

#### 2. Псевдокод

```text
1. Считать N, K и массив a[0…N−1].

2. Если K == 1:
       Контрастов нет (нет пар соседей) → ответ 0

3. Построить массив d[0…N−2], где:
       d[i] = (a[i] - a[i+1])²

4. Вычислить начальную сумму:
       s = sum(d[0…K−2])  // контрасты первого окна

5. Завести переменную max_s = s

6. Для pos = 1 … N-K:
       s = s - d[pos-1]          // убираем старый (левый) контраст
           + d[pos + K - 2]      // добавляем новый (правый) контраст
       max_s = max(max_s, s)

7. Вывести max_s
```

---

#### 3. Python code
```python
import sys
def max_local_contrast(a, K):
    N = len(a)
    if K == 1:# нет пар
        return 0

    # 1. первые K-1 контрастов
    cur = sum((a[i] - a[i + 1]) ** 2 for i in range(K - 1))
    best = cur

    # 2. скользящее окно
    for left in range(1, N - K + 1):
        cur -= (a[left - 1] - a[left]) ** 2           # ушёл слева
        cur += (a[left + K - 2] - a[left + K - 1]) ** 2  # добавился справа
        if cur > best:
            best = cur
    return best
```

---
#### 3. Сложность

- **Время:**  
  $O(N)$ — одно проход по массиву $a$, одно скользящее окно по $d$

- **Память:**  
  $O(1)$ — можно не хранить весь $d$, а пересчитывать нужные элементы на лету
---
##  Задача B. Binary Classifier

Абдикожа собрал $N$ фотографий друзей, для каждой из которых он отметил, улыбается ли человек (метка $Y_i = 1$) или нет ($Y_i = 0$). Затем он запустил бинарный классификатор, который выдал вероятность $P_i \in (0.0, 1.0)$ того, что человек на фото улыбается.

После этого он выбрал некоторый **порог** $T$ и оставил только те фотографии, для которых $P_i \ge T$. Он заметил, что при изменении порога $T$ точность (precision) может **уменьшаться** — то есть модель становится менее уверенной. Абдикожа решил найти все такие **значения порога $T$**, в которых функция $\text{PRECISION}(T)$ убывает.

---

#### Определения

- **True Positive (TP)** — число отобранных фото ($P_i \ge T$), где $Y_i = 1$
- **False Positive (FP)** — число отобранных фото ($P_i \ge T$), где $Y_i = 0$
- **Precision:**  
  $$
  \text{PRECISION}(T) = \frac{TP}{TP + FP}
  $$

---
## Решение

### Идея

- Точность меняется только в точках $T = P_i$
- Сортируем пары $(Y_i, P_i)$ по убыванию $P_i$
- Поддерживаем TP, FP и считаем точность до и после включения новой фотографии
- Если $\text{after} < \text{before}$ — сохраняем $T = P_i$

---

### 3. Алгоритм

```text
1. Считать пары (Y_i, P_i)
2. Отсортировать по убыванию P_i
3. Инициализировать: tp = 0, fp = 0, prev = -1
4. Для каждой (Y_i, P_i):
     - precision_before = tp / (tp + fp)
     - если Y_i == 1 → tp += 1, иначе → fp += 1
     - precision_after = tp / (tp + fp)
     - если after < before → добавить P_i в ответ
     - prev = after
```

---

### Сложность
- Время: O(N log N)  
- Память: O(N)
---

### Python code

```python
# Read integer N
N = int(input())

# Read the N pairs (label_i, proba_i)
pairs = []
for _ in range(N):
    values = input()
    values = values.split()
    label, proba = int(values[0]), float(values[1])
    pairs.append((label, proba))

# Sort pairs by proba_i ascending
pairs.sort(key=lambda x: x[1])

# Find left_index - first i where label_i = 1
left_index = -1
for i in range(N):
    if pairs[i][0] == 1:
        left_index = i
        break

# Find right_index - last i where label_i = 0
right_index = -1
for i in range(N - 1, -1, -1):
    if pairs[i][0] == 0:
        right_index = i
        break

# Print all proba_i where label_i == 1
found = False
for i in range(left_index, right_index + 1):
    if pairs[i][0] == 1:
        print(pairs[i][1])
        found = True

if not found:
    print(0)
```

---

## Задача С - CPFED Net

В CPFED задумались, можно ли построить искусственный интеллект для помощи системе прокторинга. Для этого разрабатывается нейросеть **CPFED Net**, построенная по принципу многослойной линейной регрессии.

Каждый слой содержит $n$ нейронов, всего слоёв — $k$. Все нейроны внутри одного слоя получают один и тот же вход — суммарное значение с предыдущего слоя (на первом слое — это просто входной сигнал $x$).

Используется техника **Dropout** — случайное "отключение" нейронов:
- с вероятностью $p$ нейрон выдаёт значение $0.0$;
- с вероятностью $(1 - p)$ нейрон выдаёт:
  $$
  y_j = a_j \cdot x + b_j
  $$

Dropout применяется **независимо** для каждого нейрона.

Финальный результат сети — сумма выходов **всех нейронов последнего слоя**.

---

### Ваша задача

Вычислите **математическое ожидание** финального результата нейросети.

**Что такое математическое ожидание?**  
Это среднее значение выходной величины, если эксперимент (отключение нейронов) повторяется бесконечное число раз.

Если нейрон работает с вероятностью $(1 - p)$, его ожидаемый вклад:
$$
\mathbb{E}[y_j] = (1 - p)(a_j \cdot x + b_j)
$$

---

### Формат ввода

В первой строке четыре значения:
- $x$ — входной сигнал (вещественное число)
- $k$ — число слоёв $(1 \le k \le 4)$
- $n$ — число нейронов в каждом слое $(2 \le n \le 10^5)$
- $p$ — вероятность отключения нейрона $(0 \le p \le 1)$

Далее $k \cdot n$ строк — по одной на каждый нейрон, сначала $n$ нейронов первого слоя, затем второго и т.д.  
Каждая строка содержит два целых числа $a_i$ и $b_i$ $(−50 \le a_i, b_i \le 50)$ — параметры линейной регрессии нейрона.

---

### Формат вывода

Одно вещественное число — математическое ожидание финального выхода сети.  
Ответ считается корректным, если абсолютная или относительная погрешность не превышает $10^{-6}$.

## Решение

Для каждого слоя $L$:

$$
y_{l,j} =
\begin{cases}
0, & \text{с вероятностью } p \\[4pt]
a_{l,j} \cdot z_{l-1} + b_{l,j}, & \text{с вероятностью } 1 - p
\end{cases}
$$

$$
z_{l-1} = \sum_{j=1}^{n} y_{l-1,j}
\quad\Rightarrow\quad
\mathbb{E}[z_l] = (1 - p) \left( \left( \sum_{j=1}^{n} a_{l,j} \right) \cdot \mathbb{E}[z_{l-1}] + \sum_{j=1}^{n} b_{l,j} \right)
$$

База: $z_0 = x$  
Искомое значение: $\mathbb{E}[z_k]$

---

### 2. Псевдокод

1. Считать $x,\;k,\;n,\;p$  
2. $S \leftarrow x$  
3. Для каждого слоя:
   - $sumA \leftarrow \sum a_{l,j}$  
   - $sumB \leftarrow \sum b_{l,j}$  
   - $S \leftarrow (1 - p)(sumA \cdot S + sumB)$  
4. Вывести $S$

---

### 3. Сложность

- **Время:** $O(k \cdot n)$  
- **Память:** $O(1)$ (можно считать на лету)

---

### 4. Код (Python)

```python
def main():
    # Read input
    parts = input().split()
    x = float(parts[0])
    k = int(parts[1])
    n = int(parts[2])
    p = float(parts[3])
    
    a = []
    b = []
    for _ in range(k):
        layer_a = []
        layer_b = []
        for _ in range(n):
            coef_a, coef_b = map(int, input().split())
            layer_a.append(coef_a)
            layer_b.append(coef_b)
        a.append(layer_a)
        b.append(layer_b)
    
    prev_layer = x
    for layer in range(k):
        sum_val = 0
        for i in range(n):
            sum_val += a[layer][i] * prev_layer + b[layer][i]
        prev_layer = sum_val * (1 - p)
    
    print(f"{prev_layer:.6f}")
```

## D. DSML Feature Engineering

Эта задача вдохновлена эпохой, когда нейросетей ещё не было — а сообщество ML-специалистов Казахстана **DSML KZ** ([www.dsml.kz](https://www.dsml.kz)) уже было!

Ещё до эпохи глубинного обучения инженеры решали задачи классификации, извлекая признаки вручную и обучая простые, но мощные модели — такие как логистическая регрессия. И хотя времена изменились, умение понимать структуру данных и работать без магии остаётся одним из самых ценных навыков.

В рамках этой задачи мы предлагаем вам погрузиться в атмосферу "олдскульного" машинного обучения — чтобы вы почувствовали, каково это: вытащить максимум из данных без единого слоя нейросети, опираясь только на здравый смысл, математику и немного изобретательности.

---

### 🎯 Ваша цель

Придумать признаки, которые можно извлечь из **зашумлённого изображения** и подать в **логистическую регрессию**, чтобы классификация работала как можно лучше.

Для этого реализуйте метод:

```python
def extract_features(images):
    # images: N x 28 x 28
    features_list = []
    for image in images:
        features = [image.max(), image.std(), image.mean()]
        features_list.append(features)
    return features_list
```

- images — список из $N$ изображений  
- Каждое изображение — NumPy-массив размера $28 \times 28$, значения от 0 до 255  
- Функция должна вернуть список из $N$ векторов признаков  
- Каждый вектор должен содержать **не более 20 признаков** $(F \le 20)$

---

### ⚠ Проблема

Ваши враги сильно испортили изображения:

- **Бимодальный шум**: часть пикселей заменена на значения, близкие к 0 или 255  
  (шум моделируется через **бета-распределение**)
- **Гауссов шум**: к каждому пикселю добавлена случайная величина из $N(0, \sigma^2)$

---

### ⏱ Ограничения

- Время на **весь пайплайн** (извлечение признаков, обучение и предсказание): **не более 10 секунд**
- Разрешённые библиотеки: numpy, scikit-learn, scipy, pandas
- Запрещены: нейросети, трансформеры, внешние эмбеддинги, предобученные модели
---

### 🧪 Система оценивания
Будет 3 набора тестов:

| № | Описание                                 | Метрика     | Баллы макс |
|---|------------------------------------------|-------------|------------|
| 1 | Классификация **цифр без шума**          | score   | 150        |
| 2 | Классификация **цифр с шумом**           | score   | 150        |
| 3 | Классификация **10 двухбуквенных слов**  | score   | 150        |

$$
\text{score} = \left\lfloor \max(0,\ \text{accuracy} - 25) \right\rfloor \times 2
$$

$$
\text{где } \text{accuracy} \in [0, 100] \text{ — точность классификации в процентах.}
$$

---

## Бейзлайны для оценки решений

Интересно, что задача по сути маскирует **понижение размерности** под задачу **извлечения признаков**.
Для корректного скоринга мы подготовили два референсных решения:

---

### ✅ 1. **MEDIAN PCA** — Хорошее решение

**Описание:**
- медианная фильтрация входных изображений (устраняет бимодальный и гауссов шум)
- понижение размерности с помощью PCA до 20 признаков
- логистическая регрессия по извлечённым признакам

**Баллы по датасетам (примерно):**  
**108 + 94 + 82 = 284**

```python
import numpy as np
from scipy.ndimage import median_filter
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split

# --- Медианная фильтрация изображений ---
def denoise_with_median(X, size=2):
    X_denoised = np.zeros_like(X)
    for i in range(X.shape[0]):
        img = X[i].reshape(28, 28)
        filtered = median_filter(img, size=size)
        X_denoised[i] = filtered.flatten()
    return X_denoised

# --- Экстрактор признаков: медианная фильтрация + PCA ---
class PCADenoizedFeatureExtractor:
    def __init__(self, pca_components: int):
        self.pca_components = pca_components
        self.pca = PCA(n_components=self.pca_components)

    def fit(self, X):
        self.pca.fit(X / 255.0)

    def transform(self, X):
        denoized = denoise_with_median(X, size=2)
        return self.pca.transform(denoized / 255.0)

# --- Основной пайплайн решения ---
def denoize_pca_solution(X_train, X_test, y_train):
    feature_extractor = PCADenoizedFeatureExtractor(pca_components=20)
    feature_extractor.fit(X_train)
    train_features = feature_extractor.transform(X_train)
    test_features = feature_extractor.transform(X_test)

    model = LogisticRegression(multi_class="multinomial", solver="lbfgs", max_iter=5000)
    model.fit(train_features, y_train)
    y_pred = model.predict(test_features)
    return y_pred

def main(X, y):
    """Для краткости пропустим часть с загрузкой данных"""

    # Разделение на train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.5, random_state=42
    )

    # Предсказание и метрика
    y_pred = denoize_pca_solution(X_train, X_test, y_train)
    acc = accuracy_score(y_test, y_pred)
    print(f"Denoize PCA solution accuracy: {acc:.4f}")
```

### 🧱 2. **RESHAPE** — доступное решение без знаний ML

**Описание:**
- уменьшение размеров изображения с помощью бикубической интерполяции
- ресайз до $5 \times 4$ и развёртка в вектор длины 20
- логистическая регрессия по этим признакам

**Баллы по датасетам (примерно):**  
**44 + 16 + 42 = 102**

```python
class ResizeFeatureExtractor:
    def __init__(self, n_rows: int, n_cols: int):
        self.n_rows = n_rows
        self.n_cols = n_cols
        self.original_size = (28, 28)

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        n_samples = X.shape[0]
        resized = np.zeros((n_samples, self.n_rows * self.n_cols), dtype=np.float32)

        zoom_factors = (
            self.n_rows / self.original_size[0],
            self.n_cols / self.original_size[1],
        )

        for i in range(n_samples):
            img = X[i].reshape(self.original_size)
            img_resized = zoom(img, zoom_factors, order=3)  # bi-cubic interpolation
            resized[i] = img_resized.flatten()

        return resized

def resize_solution(X_train, X_test, y_train):
    # Обучаем
    resize_feature_extractor = ResizeFeatureExtractor(5, 4)
    resize_feature_extractor.fit(X_train)
    train_features = resize_feature_extractor.transform(denoise_with_median(X_train))
    test_features = resize_feature_extractor.transform(denoise_with_median(X_test))

    model = LogisticRegression(multi_class="multinomial", solver="lbfgs", max_iter=5000)
    model.fit(train_features, y_train)
    y_pred = model.predict(test_features)
    return y_pred

# --- Main function for this solution ---
def main(X, y):
    """Для краткости пропустим часть с загрузкой данных"""
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.5, random_state=42
    )
    y_pred_resize = resize_solution(X_train, X_test, y_train)

    acc_resize = accuracy_score(y_test, y_pred_resize)
    print(f"Resize solution: {acc_resize:.4f}")
```

## Тематическая классификация научных абстрактов (arXiv)

В научном мире ежедневно публикуются тысячи статей на [arXiv.org](https://arxiv.org) — одном из крупнейших репозиториев препринтов по математике, физике, компьютерным наукам, экономике и другим дисциплинам.

Каждая статья содержит **абстракт** — краткое резюме, в котором изложены цели, методы и основные идеи исследования. Как правило, уже по одному предложению из абстракта можно понять, к какой области относится статья.

---

### 🎯 Цель

Построить **модель**, которая по **отдельному предложению из абстракта** будет определять **тематику статьи**.

---

### 🧩 Что нужно реализовать

В отличие от предыдущего задания, где вы разрабатывали feature extractor для компьютерного зрения, здесь вы будете отправлять **полный пайплайн**, включающий:

- препроцессинг текста;
- извлечение признаков;
- обучение модели;
- предсказание тематики для новых данных.

---

### ⏱ Ограничения

- Время на **весь пайплайн** (извлечение признаков, обучение и предсказание): **не более 10 секунд**
- Разрешённые библиотеки: numpy, scikit-learn, scipy, pandas
- Запрещены: нейросети, трансформеры, внешние эмбеддинги, предобученные модели
---
### 🔓 Что разрешено

- Любой вариант классической **предобработки текста**:
- Любая модель из sklearn, подходящая под задачу
---

### 🗂 Формат ввода

**Датасет** — это tsv-таблица с разделителем **табуляция**.

| text | category |
|------|----------|
| предложение (абстракт) | категория статьи |

**Категории**:
- Если категория указана (3000 примеров) — используйте как **обучающую выборку**
- Если категория = UNKNOWN (1000 примеров) — это **тест**, требуется предсказание

#### Пример:

```
| text                                                   | category |
|--------------------------------------------------------|----------|
| Biomolecules often have some bond lengths.             | Biology  |
| Contextuality is well known as a vital resource.       | Physics  |
| Protein-specific large language models.                | UNKNOWN  |
| In many applications Protein LLMs.                     | UNKNOWN  |
```

---

### 📈 Формула итоговых баллов

Результат зависит от точности (accuracy) **мультиклассификации**:

```
  limited_accuracy = max(15, min(accuracy, 90))
  score = int((limited_accuracy - 15) ** 2 / 25)
```
---

## Решение TF-IDF - хорошее решение

### Описание:
- векторизовать используя tfidf (https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html) vectorizer
- подать в логистическую регрессию
- Баллы по датасетам - 144 + 139 = 283

### Код

```python
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

from nltk.stem.snowball import SnowballStemmer
import re

data = pd.read_csv("arxiv_data/arxiv_dataset.csv", index_col=0)

X_train = data.loc[:2999, 'sampled_sentence']
X_test = data.loc[3000:, 'sampled_sentence']
y_train = data.loc[:2999, 'paper_section']

# Инициализируем стеммер
stemmer = SnowballStemmer("english")

# Кастомная токенизация + стемминг
def tokenize_and_stem(text):
    # Базовая нормализация текста
    text = text.lower()
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    tokens = text.strip().split()
    return [stemmer.stem(token) for token in tokens if len(token) > 2]

vectorizer = TfidfVectorizer(
    tokenizer=tokenize_and_stem,
    ngram_range=(1, 2),          # unigrams + bigrams
    stop_words='english',        # убираем частые слова
    max_df=0.06,                 # убираем супервстречающиеся слова
)

X_train_vec = vectorizer.fit_transform(X_train)  # sparse matrix
X_test_vec = vectorizer.transform(X_test)

model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)

y_pred = model.predict(X_test_vec)
```

Всем спасибо, кто осилил этот пост до конца
