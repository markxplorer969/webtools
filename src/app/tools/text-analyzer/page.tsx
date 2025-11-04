'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Type, FileText, BarChart, Hash, Clock, BookOpen, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';



interface TextAnalysis {
  characterCount: number;
  characterCountNoSpaces: number;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTime: number;
  speakingTime: number;
  longestWord: string;
  averageWordLength: number;
  averageSentenceLength: number;
  readabilityScore: number;
  readabilityLevel: string;
}

export default function TextAnalyzer() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState<TextAnalysis>({
    characterCount: 0,
    characterCountNoSpaces: 0,
    wordCount: 0,
    sentenceCount: 0,
    paragraphCount: 0,
    readingTime: 0,
    speakingTime: 0,
    longestWord: '',
    averageWordLength: 0,
    averageSentenceLength: 0,
    readabilityScore: 0,
    readabilityLevel: 'Easy'
  });

  const analyzeText = (inputText: string) => {
    if (!inputText.trim()) {
      setAnalysis({
        characterCount: 0,
        characterCountNoSpaces: 0,
        wordCount: 0,
        sentenceCount: 0,
        paragraphCount: 0,
        readingTime: 0,
        speakingTime: 0,
        longestWord: '',
        averageWordLength: 0,
        averageSentenceLength: 0,
        readabilityScore: 0,
        readabilityLevel: 'Easy'
      });
      return;
    }

    // Character counts
    const characterCount = inputText.length;
    const characterCountNoSpaces = inputText.replace(/\s/g, '').length;

    // Word count
    const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // Sentence count
    const sentences = inputText.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const sentenceCount = sentences.length;

    // Paragraph count
    const paragraphs = inputText.split(/\n\n+/).filter(paragraph => paragraph.trim().length > 0);
    const paragraphCount = paragraphs.length;

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);

    // Speaking time (average 150 words per minute)
    const speakingTime = Math.ceil(wordCount / 150);

    // Longest word
    const longestWord = words.reduce((longest, current) => 
      current.length > longest.length ? current : longest, '');

    // Average word length
    const averageWordLength = words.length > 0 
      ? Math.round((words.reduce((sum, word) => sum + word.length, 0) / words.length) * 10) / 10
      : 0;

    // Average sentence length
    const averageSentenceLength = sentenceCount > 0
      ? Math.round((wordCount / sentenceCount) * 10) / 10
      : 0;

    // Simple readability score (based on average sentence length and word length)
    const readabilityScore = Math.max(0, Math.min(100, 
      100 - (averageSentenceLength * 2) - (averageWordLength * 3)));

    // Readability level
    let readabilityLevel = 'Very Easy';
    if (readabilityScore < 30) readabilityLevel = 'Very Difficult';
    else if (readabilityScore < 50) readabilityLevel = 'Difficult';
    else if (readabilityScore < 60) readabilityLevel = 'Fairly Difficult';
    else if (readabilityScore < 70) readabilityLevel = 'Standard';
    else if (readabilityScore < 80) readabilityLevel = 'Fairly Easy';
    else if (readabilityScore < 90) readabilityLevel = 'Easy';

    setAnalysis({
      characterCount,
      characterCountNoSpaces,
      wordCount,
      sentenceCount,
      paragraphCount,
      readingTime,
      speakingTime,
      longestWord,
      averageWordLength,
      averageSentenceLength,
      readabilityScore,
      readabilityLevel
    });
  };

  useEffect(() => {
    analyzeText(text);
  }, [text]);

  const clearText = () => {
    setText('');
    toast.success('Text cleared');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success('Text copied to clipboard');
  };

  const getReadabilityColor = () => {
    if (analysis.readabilityScore >= 80) return 'text-green-400';
    if (analysis.readabilityScore >= 60) return 'text-yellow-400';
    if (analysis.readabilityScore >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getReadabilityBg = () => {
    if (analysis.readabilityScore >= 80) return 'bg-green-500';
    if (analysis.readabilityScore >= 60) return 'bg-yellow-500';
    if (analysis.readabilityScore >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={cardVariants} className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Type className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">Text Analyzer</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Analyze text for readability, word count, and sentiment
          </p>
        </motion.div>

        {/* Text Input */}
        <motion.div variants={cardVariants}>
          <Card className="glass border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Input Text</CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter or paste your text to analyze
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    disabled={!text}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={clearText}
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    disabled={!text}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here to analyze..."
                className="bg-gray-800 border-gray-700 text-white min-h-[200px] resize-none"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Analysis Results */}
        <motion.div variants={cardVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Stats */}
            <Card className="glass border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Hash className="w-5 h-5 text-blue-400" />
                  <span>Basic Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Characters</span>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {analysis.characterCount.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">No Spaces</span>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {analysis.characterCountNoSpaces.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Words</span>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {analysis.wordCount.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Sentences</span>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {analysis.sentenceCount.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Paragraphs</span>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {analysis.paragraphCount.toLocaleString()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Time Analysis */}
            <Card className="glass border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span>Time Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Reading Time</span>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {analysis.readingTime} min
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Speaking Time</span>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {analysis.speakingTime} min
                  </Badge>
                </div>
                <div className="pt-4">
                  <div className="text-sm text-gray-400 mb-2">Reading Speed</div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>• Average: 200 WPM</div>
                    <div>• Your text: {Math.round(analysis.wordCount / Math.max(analysis.readingTime, 1))} WPM</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Word Analysis */}
            <Card className="glass border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <span>Word Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Longest Word</span>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {analysis.longestWord || 'N/A'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Avg Word Length</span>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {analysis.averageWordLength} chars
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Avg Sentence Length</span>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                    {analysis.averageSentenceLength} words
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Readability Analysis */}
        <motion.div variants={cardVariants}>
          <Card className="glass border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <BarChart className="w-5 h-5 text-yellow-400" />
                <span>Readability Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {analysis.readabilityLevel}
                  </div>
                  <div className="text-sm text-gray-400">
                    Score: {Math.round(analysis.readabilityScore)}/100
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${getReadabilityBg()} text-white`}>
                    {Math.round(analysis.readabilityScore)}%
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Readability</span>
                  <span className={getReadabilityColor()}>{analysis.readabilityLevel}</span>
                </div>
                <Progress 
                  value={analysis.readabilityScore} 
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-400">Very Easy</div>
                  <div className="text-xs text-gray-500">90-100</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-yellow-400">Easy</div>
                  <div className="text-xs text-gray-500">80-89</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-orange-400">Standard</div>
                  <div className="text-xs text-gray-500">60-79</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-red-400">Difficult</div>
                  <div className="text-xs text-gray-500">0-59</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tips */}
        <motion.div variants={cardVariants}>
          <Card className="glass border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-2">Analysis Tips</h4>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Aim for 15-20 words per sentence for better readability</li>
                    <li>• Keep paragraphs short (3-4 sentences) for online content</li>
                    <li>• Use simple words to improve accessibility</li>
                    <li>• Consider your audience when choosing complexity level</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}