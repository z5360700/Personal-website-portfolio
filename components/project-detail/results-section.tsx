interface ResultsSectionProps {
  results: string
}

export function ResultsSection({ results }: ResultsSectionProps) {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
      <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4">Results & Impact</h2>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-green-700 dark:text-green-300 leading-relaxed whitespace-pre-line text-sm">{results}</p>
      </div>
    </div>
  )
}
