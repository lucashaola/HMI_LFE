/** Displays questions for a specific category or all unlocked categories */
async function showCategoryQuestions(category = null, retryQuestions = null) {
    const identificationCode = localStorage.getItem('userCode');
    if (!identificationCode) return;

    try {
        const response = await fetch(`/api/test/${identificationCode}`);
        const testData = await response.json();

        let questionsToHandle;
        let totalQuestions;

        if (retryQuestions) {
            questionsToHandle = retryQuestions;
            totalQuestions = retryQuestions.length;
        } else {
            const categoriesToHandle = category ? [category] : Object.keys(categoryQuestions);
            questionsToHandle = [];
            let hasRemainingQuestions = false;

            for (const currentCategory of categoriesToHandle) {
                const correctlyAnswered = JSON.parse(testData.correctly_answered || '{}')[currentCategory] || [];
                const remainingQuestionsInCategory = categoryQuestions[currentCategory].filter((_, index) =>
                    !correctlyAnswered.includes(index));

                if (remainingQuestionsInCategory.length > 0) {
                    hasRemainingQuestions = true;

                    const isLocked = await isCategoryUnlocked(currentCategory);
                    if (!isLocked) continue;

                    const questionsToAdd = remainingQuestionsInCategory.map(question => ({
                        category: currentCategory,
                        question: question,
                        questionIndex: categoryQuestions[currentCategory].indexOf(question)
                    }));
                    questionsToHandle.push(...questionsToAdd);
                }
            }

            if (!hasRemainingQuestions) {
                if (category) {
                    const categoryName = categories.find(cat => cat.key === category)?.name || category;
                    showCompletedCategoryMessage(categoryName);
                } else {
                    showPartialCompletionMessage()
                }
                return;
            }

            if (hasRemainingQuestions && questionsToHandle.length === 0) {
                showLockedCategoryMessage();
                return;
            }

            totalQuestions = questionsToHandle.length;
        }

        let currentQuestionIndex = 0;
        const questionsToRetry = [];

        for (const questionItem of questionsToHandle) {
            const result = await Swal.fire({
                title: questionItem.question.question,
                html: `
                    <div class="question-progress">
                        Frage ${currentQuestionIndex + 1} / ${totalQuestions}
                    </div>
                    ${questionItem.question.options
                    .map((option, index) => `
                            <div class="question-option">
                                <label class="question-label" for="option${index}">
                                    <input type="radio" id="option${index}" name="question" value="${index}">
                                    <span class="option-text">${option.text}</span>
                                </label>
                            </div>
                        `)
                    .join('')}
                `,
                showCancelButton: true,
                confirmButtonText: 'Bestätigen',
                cancelButtonText: 'Abbrechen',
                confirmButtonColor: '#e4e4e7',
                cancelButtonColor: '#e4e4e7',
                reverseButtons: true,
                didOpen: () => {
                    const style = document.createElement('style');
                    style.textContent = `
                        .question-progress-container {
                            position: relative;
                            margin-bottom: 20px;
                        }
                        .question-progress {
                            position: absolute;
                            top: 0;
                            right: 0;
                            font-size: 14px;
                            color: #333;
                            background: rgba(255, 255, 255, 0.8);
                            padding: 5px 10px;
                            border-radius: 5px;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                        }
                        .question-title {
                            margin-top: 30px; 
                            text-align: center;
                            font-size: 20px;
                            font-weight: bold;
                        }
                        .question-option {
                            text-align: left;
                            margin: 10px 0;
                            padding: 10px;
                            border-radius: 5px;
                        }
                        .question-option:hover {
                            background-color: #f5f5f5;
                        }
                        .question-label {
                            display: flex;
                            align-items: center;
                            width: 100%;
                            cursor: pointer;
                        }
                        .question-label input[type="radio"] {
                            margin-right: 10px;
                        }
                        .option-text {
                            flex-grow: 1;
                        }
                    `;
                    document.head.appendChild(style);
                },
                preConfirm: () => {
                    const selectedOption = document.querySelector('input[name="question"]:checked');
                    if (!selectedOption) {
                        Swal.showValidationMessage('Bitte wählen Sie eine Option aus');
                        return false;
                    }
                    return selectedOption.value;
                }
            });

            if (result.dismiss === Swal.DismissReason.cancel) {
                return;
            }

            if (result.isConfirmed) {
                const selectedOption = questionItem.question.options[result.value];
                const isAnsweredCorrectly = selectedOption.correct;

                await updateTestProgress(identificationCode, questionItem.category, questionItem.questionIndex, isAnsweredCorrectly);

                await Swal.fire({
                    title: isAnsweredCorrectly ? 'Richtig!' : 'Falsch!',
                    text: isAnsweredCorrectly ? 'Gut gemacht!' : 'Versuchen Sie es später noch einmal!',
                    icon: isAnsweredCorrectly ? 'success' : 'error',
                    confirmButtonColor: '#e4e4e7'
                });

                if (!isAnsweredCorrectly) {
                    questionsToRetry.push(questionItem);
                }
            }

            currentQuestionIndex++;
        }

        if (questionsToRetry.length > 0) {
            await showCategoryQuestions(category, questionsToRetry);
        } else if (!category) {
            (await hasLockedCategories() ? showPartialCompletionMessage() : showCompletionMessage());
        } else {
            if (await checkAllQuestionsAnsweredCorrectly()) {
                showCompletionMessage();
            } else {
                await showTestOverview();
            }                
        }

    } catch (error) {
        console.error('Error showing questions:', error);
    }
}

/** Checks if there are any locked categories with unanswered question, returns boolean */
async function hasLockedCategories() {
    const identificationCode = localStorage.getItem('userCode');
    const response = await fetch(`/api/test/${identificationCode}`);
    const testData = await response.json();

    for (const category of Object.keys(categoryQuestions)) {
        const isLocked = await isCategoryUnlocked(category);
        const correctlyAnswered = JSON.parse(testData.correctly_answered || '{}')[category] || [];
        const hasRemainingQuestions = categoryQuestions[category].length > correctlyAnswered.length;

        if (isLocked && hasRemainingQuestions) {
            return true;
        }
    }
    return false;
}

function showCompletedCategoryMessage(categoryName) {
    Swal.fire({
        title: 'Keine Fragen übrig!',
        text: `Sie haben bereits alle Fragen in der Kategorie "${categoryName}" richtig beantwortet.`,
        icon: 'success',
        confirmButtonColor: '#e4e4e7'
    });
}

function showPartialCompletionMessage() {
    Swal.fire({
        title: 'Test abgeschlossen!',
        text: 'Sie haben bereits alle verfügbaren Fragen richtig beantwortet. Schalten Sie mehr frei, indem Sie entweder die Schnellübersicht oder alle Folien zur Kategorie im Tutorial anschauen.',
        icon: 'success',
        confirmButtonColor: '#6182b3'
    });
}

function showCompletionMessage() {
    Swal.fire({
        title: 'Herzlichen Glückwunsch!',
        text: 'Sie haben nun alle Fragen richtig beantwortet! Testen Sie nun das teilautomatisierte Fahren für mehr Sicherheit und Komfort! Viel Spaß!!',
        icon: 'success',
        confirmButtonColor: '#6182b3'
    });
}

function showLockedCategoryMessage() {
    Swal.fire({
        title: 'Testfragen nicht verfügbar',
        text: 'Schauen Sie sich die Inhalte des Tutorials über den Schnellüberblick oder das Hauptmenü an',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#e4e4e7',
    });
}

/** Updates the user's progress in the backend based on their answers */
async function updateTestProgress(identificationCode, category, questionIndex, isCorrect) {
    try {
        const response = await fetch(`/api/test/${identificationCode}/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                category,
                questionIndex,
                isCorrect
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update test progress');
        }

        await showTestOverview();

    } catch (error) {
        console.error('Error updating test progress:', error);
    }
}

/** Checks if all questions across all categories have been answered correctly */
async function checkAllQuestionsAnsweredCorrectly() {
    const identificationCode = localStorage.getItem('userCode');
    const response = await fetch(`/api/test/${identificationCode}`);
    const testData = await response.json();
    
    for (const category of Object.keys(categoryQuestions)) {
        const correctlyAnswered = JSON.parse(testData.correctly_answered || '{}')[category] || [];
        if (correctlyAnswered.length < categoryQuestions[category].length) {
            return false;
        }
    }
    return true;
}

/** Displays an overview of the user's test progress, including overall progress and progress per category. It also allows users to start tests for specific categories or all available questions.*/
async function showTestOverview() {
    const testOverviewContainer = document.querySelector('.test-overview');
    const identificationCode = localStorage.getItem('userCode');

    if (!identificationCode) {
        testOverviewContainer.innerHTML = `
            <div class="no-content">
                <p>Melden Sie sich an, um Ihren Fortschritt zu sehen</p>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(`/api/test/${identificationCode}`);
        const testData = await response.json();
        const unlockedCategories = await getUnlockedCategories();

        const totalQuestions = Object.values(categoryQuestions).reduce((sum, category) => sum + category.length, 0);
        const correctlyAnswered = Object.values(JSON.parse(testData.correctly_answered || '{}')).reduce((sum, answers) => sum + answers.length, 0);

        testOverviewContainer.innerHTML = `
            <div class="test-header">
                <h1>Fahrerassistenzsysteme: Testfragen</h1>
                <h2>Gesamter Fortschritt</h2>
                <div class="total-progress-container">
                    <div class="total-progress-bar">
                        <div class="total-progress-fill ${correctlyAnswered === 0 ? 'zero-progress' : ''}" style="width: ${(correctlyAnswered / totalQuestions) * 100}%">
                            ${correctlyAnswered}/${totalQuestions}
                        </div>
                    </div>
                </div>
            </div>
            <div class="question-action-container">
                <h2 class="heading">Alle verfügbaren Fragen auf einmal beantworten</h2>
                <button class="start-btn">Starten ▶</button>
            </div>
            <hr>
            <h2 class="categories-heading">Beantworten nach Kategorien</h2>
            <div class="test-progress-circles">
                ${categories.map(category => {
                const correctlyAnsweredCategory = JSON.parse(testData.correctly_answered || '{}')[category.key] || [];
                const incorrectlyAnswered = JSON.parse(testData.currently_incorrectly_answered || '{}')[category.key] || [];
                const totalQuestionsCategory = categoryQuestions[category.key].length;
                const isLocked = !unlockedCategories.includes(category.key);
    
                return `
                            <div class="test-progress-circle-item ${isLocked ? 'locked' : 'unlocked'}" data-category="${category.key}">
                                <img src="${category.icon}" class="category-icon" alt="">
                                <div class="category-info">
                                    <div class="category-name">${category.name}</div>
                                    <div class="test-stats">
                                        <span class="correct-answers">Richtig: ${correctlyAnsweredCategory.length}/${totalQuestionsCategory}</span>
                                        ${incorrectlyAnswered.length > 0 ? `<span class="incorrect-answers">Falsch: ${incorrectlyAnswered.length}</span>` : ''}
                                    </div>
                                </div>
                                <div class="progress-circle ${correctlyAnsweredCategory.length === totalQuestionsCategory ? 'completed' : ''}">
                                    <div class="circle-icon">✓</div>
                                    <svg class="progress-ring">
                                        <circle class="progress-ring-bg" cx="16" cy="16" r="12" />
                                        <circle class="progress-ring-progress" cx="16" cy="16" r="12" />
                                    </svg>
                                </div>
                            </div>
            `;
        }).join('')}
        </div>`;

        document.querySelectorAll('.test-progress-circle-item').forEach(item => {
            const category = item.dataset.category;
            let touchStartX = 0;
            let touchStartY = 0;
            let isScrolling = false;
            const movementThreshold = 10; // Pixels moved to consider it a scroll

            const handler = async () => {
                const isUnlocked = await isCategoryUnlocked(category);
                if (isUnlocked) {
                    await showCategoryQuestions(category);
                } else {
                    await showLockedCategoryMessage();
                }
            };

            // Track touch start position
            item.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                isScrolling = false;
            }, { passive: true });

            // Detect scroll gestures
            item.addEventListener('touchmove', (e) => {
                const touch = e.touches[0];
                const deltaX = Math.abs(touch.clientX - touchStartX);
                const deltaY = Math.abs(touch.clientY - touchStartY);

                if (deltaX > movementThreshold || deltaY > movementThreshold) {
                    isScrolling = true;
                }
            }, { passive: true });

            // Handle taps (only if not scrolling)
            item.addEventListener('touchend', (e) => {
                if (!isScrolling) {
                    handler();
                }
                isScrolling = false; // Reset state
            });

            // Desktop click handler
            item.addEventListener('click', handler)

            const correctlyAnsweredCategory = JSON.parse(testData.correctly_answered || '{}')[category] || [];
            const totalQuestionsCategory = categoryQuestions[category].length;
            const progress = Math.round((correctlyAnsweredCategory.length / totalQuestionsCategory) * 100);

            const circle = item.querySelector('.progress-ring-progress');
            const circumference = 2 * Math.PI * 12;
            const offset = circumference - (progress / 100) * circumference;
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = offset;
        });

        const startBtn = document.querySelector('.start-btn');
        if (startBtn) {
            startBtn.addEventListener("click", () => showCategoryQuestions());
        }

        const container = document.querySelector('.test-progress-circles');
        new PerfectScrollbar(container, {
            wheelSpeed: 1,
            wheelPropagation: true,
            suppressScrollX: true,
            minScrollbarLength: 40,
            scrollbarYMargin: 0,
            railYVisible: true
        });

    } catch (error) {
        console.error('Error fetching or displaying test data:', error);
    }
}

async function getUnlockedCategories() {
    const userCode = localStorage.getItem('userCode');
    const response = await fetch(`/api/users/${userCode}/unlocked-categories`);
    const data = await response.json();
    return data.unlockedCategories;
}

async function isCategoryUnlocked(category) {
    const unlockedCategories = await getUnlockedCategories();

    if (unlockedCategories.includes(category)) {
        await unlockCategory(category);
        return true;
    } else {
        return false;
    }
}

async function unlockCategory(category) {
    const userCode = localStorage.getItem('userCode');
    await fetch(`/api/users/${userCode}/unlock-category/${category}`, {method: 'POST'});
}