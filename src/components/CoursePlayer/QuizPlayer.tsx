import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Award, RotateCcw } from 'lucide-react';
import { QuizContent, QuizQuestion } from '../../lib/contentService';

interface QuizPlayerProps {
  quiz: QuizContent;
  onComplete: (score: number, passed: boolean) => void;
}

// ========================================
// 📝 QUIZ PLAYER CONFIGURATION
// ========================================
// This component handles quiz functionality for your courses.
// To customize quizzes, see the comments below:

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    passed: boolean;
    feedback: string[];
  } | null>(null);

  // ========================================
  // ⏰ QUIZ TIMER FUNCTIONALITY
  // ========================================
  // Timer effect - you can customize timer behavior here
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev <= 1) {
          // 🚨 AUTO-SUBMIT WHEN TIME RUNS OUT
          // You can customize this behavior:
          // - Show warning before auto-submit
          // - Allow extra time for current question
          // - Save partial progress
          handleSubmit();
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // ========================================
  // 📊 QUIZ SCORING SYSTEM
  // ========================================
  // You can customize the scoring logic here
  const handleSubmit = async () => {
    setIsSubmitted(true);
    
    // 🧮 SCORING CALCULATION
    let correctAnswers = 0;
    const feedback: string[] = [];
    
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      
      // 🎯 ANSWER VALIDATION LOGIC
      // You can customize how answers are compared:
      const isCorrect = Array.isArray(question.correctAnswer) 
        ? JSON.stringify(userAnswer?.sort()) === JSON.stringify(question.correctAnswer.sort())
        : userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
        feedback.push(`✓ Question ${quiz.questions.indexOf(question) + 1}: Correct!`);
      } else {
        feedback.push(`✗ Question ${quiz.questions.indexOf(question) + 1}: Incorrect. ${question.explanation || ''}`);
      }
    });

    // 📈 SCORE CALCULATION
    // You can modify this to use weighted scoring, partial credit, etc.
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const result = { score, passed, feedback };
    setResults(result);
    
    // 🎯 COMPLETION CALLBACK
    // This reports results back to the parent component
    // You can add additional logic here:
    // - Save results to database
    // - Update user progress
    // - Award badges/certificates
    // - Unlock next content
    onComplete(score, passed);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(quiz.timeLimit ? quiz.timeLimit * 60 : null);
    setIsSubmitted(false);
    setResults(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ========================================
  // 🎨 QUESTION RENDERING
  // ========================================
  // This function renders different question types
  const renderQuestion = (question: QuizQuestion, index: number) => {
    const userAnswer = answers[question.id];

    return (
      <div key={question.id} className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 font-semibold">{index + 1}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{question.question}</h3>
            
            {/* 📝 MULTIPLE CHOICE QUESTIONS */}
            {/* You can customize the styling and behavior here */}
            {question.type === 'multiple-choice' && (
              <div className="space-y-3">
                {question.options?.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      userAnswer === option
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={userAnswer === option}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-5 h-5 text-purple-600"
                      disabled={isSubmitted}
                    />
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* ✅ TRUE/FALSE QUESTIONS */}
            {/* You can customize the styling here */}
            {question.type === 'true-false' && (
              <div className="flex gap-4">
                {['True', 'False'].map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all flex-1 ${
                      userAnswer === option
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option}
                      checked={userAnswer === option}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-5 h-5 text-purple-600"
                      disabled={isSubmitted}
                    />
                    <span className="text-gray-900 font-medium">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* ✏️ FILL-IN-THE-BLANK QUESTIONS */}
            {/* You can add validation, auto-complete, etc. */}
            {question.type === 'fill-blank' && (
              <input
                type="text"
                value={userAnswer || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                disabled={isSubmitted}
                // 🔧 ADDITIONAL INPUT ATTRIBUTES YOU CAN ADD:
                // maxLength={50} // Limit answer length
                // pattern="[A-Za-z]+" // Regex validation
                // autoComplete="off" // Disable autocomplete
              />
            )}

            {/* 💡 EXPLANATION DISPLAY */}
            {/* Shows after quiz is submitted */}
            {isSubmitted && question.explanation && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-blue-800 text-sm">
                  <strong>Explanation:</strong> {question.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ========================================
  // 🏆 RESULTS DISPLAY
  // ========================================
  // This shows when quiz is completed
  if (results) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            results.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {results.passed ? (
              <CheckCircle className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>
          
          {/* 🎉 SUCCESS/FAILURE MESSAGES */}
          {/* You can customize these messages */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {results.passed ? 'Congratulations!' : 'Keep Learning!'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            You scored {results.score}% on this quiz
            {results.passed ? ' and passed!' : `. You need ${quiz.passingScore}% to pass.`}
          </p>

          {/* 📊 SCORE DISPLAY */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{results.score}%</div>
              <div className="text-sm text-gray-500">Your Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">{quiz.passingScore}%</div>
              <div className="text-sm text-gray-500">Passing Score</div>
            </div>
          </div>
        </div>

        {/* 📝 DETAILED FEEDBACK */}
        {/* Shows results for each question */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Results:</h3>
          {results.feedback.map((feedback, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl ${
                feedback.startsWith('✓') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <p className={`text-sm ${
                feedback.startsWith('✓') ? 'text-green-800' : 'text-red-800'
              }`}>
                {feedback}
              </p>
            </div>
          ))}
        </div>

        {/* 🔄 RETAKE OPTION */}
        {/* Only show if quiz was failed */}
        {!results.passed && (
          <div className="text-center">
            <button
              onClick={resetQuiz}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
            >
              <RotateCcw size={20} />
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    );
  }

  // ========================================
  // 📋 QUIZ INTERFACE
  // ========================================
  // Main quiz taking interface
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
          <p className="text-gray-600 mt-1">{quiz.description}</p>
        </div>
        
        {/* ⏰ TIMER DISPLAY */}
        {/* Only shows if quiz has time limit */}
        {timeLeft !== null && (
          <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl border border-orange-200">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="font-mono text-orange-800">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* 📊 PROGRESS INDICATOR */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Object.keys(answers).length} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 📝 CURRENT QUESTION */}
      <div className="mb-8">
        {renderQuestion(quiz.questions[currentQuestion], currentQuestion)}
      </div>

      {/* 🧭 NAVIGATION CONTROLS */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {/* 🔢 QUESTION NAVIGATION */}
        {/* Dots showing all questions with status */}
        <div className="flex gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-10 h-10 rounded-full font-medium transition-colors ${
                index === currentQuestion
                  ? 'bg-purple-500 text-white'
                  : answers[quiz.questions[index].id]
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* ✅ SUBMIT/NEXT BUTTON */}
        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < quiz.questions.length}
            className="px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
            className="px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;

// ========================================
// 📋 QUIZ CUSTOMIZATION GUIDE
// ========================================
/*
To customize quizzes for your courses:

1. 📝 QUESTION TYPES:
   - multiple-choice: Radio buttons with options
   - true-false: Simple True/False selection
   - fill-blank: Text input for answers
   - You can add more types like:
     * multiple-select (checkboxes)
     * drag-and-drop
     * image-based questions
     * code completion

2. ⏰ TIMING OPTIONS:
   - Set timeLimit in minutes (null for no limit)
   - Customize timer warnings
   - Add time per question limits
   - Implement pause/resume functionality

3. 🎯 SCORING SYSTEM:
   - Modify passingScore percentage
   - Add weighted scoring by question
   - Implement partial credit
   - Add bonus points for speed

4. 🎨 STYLING:
   - Change color schemes
   - Modify question layouts
   - Add animations and transitions
   - Customize success/failure messages

5. 📊 ANALYTICS:
   - Track time spent per question
   - Monitor answer patterns
   - Implement difficulty analysis
   - Add performance insights

6. 🔄 RETAKE LOGIC:
   - Set maximum attempts
   - Randomize question order
   - Use different question pools
   - Implement cooldown periods

7. 🏆 GAMIFICATION:
   - Add points and badges
   - Implement leaderboards
   - Create achievement systems
   - Add streak counters

8. 📱 ACCESSIBILITY:
   - Add keyboard navigation
   - Implement screen reader support
   - Provide high contrast mode
   - Add text-to-speech options
*/