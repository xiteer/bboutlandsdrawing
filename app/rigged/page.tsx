import Link from 'next/link';

export default function RiggedPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-zinc-900 to-black -z-10" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            RIGGED!?!?
          </h1>
          <p className="text-gray-400 text-lg">A totally serious explanation of our drawing system</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Is it really rigged? 🤔</h2>
            <p className="text-gray-300 leading-relaxed">
              Short answer: <span className="text-white font-semibold">Nope!</span> But we understand the suspicion. 
              Whenever someone loses, it&apos;s natural to wonder if the dice were loaded. So let&apos;s break down exactly 
              how our drawing system works and why it&apos;s as fair as it gets.
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">How the Drawing Works 🎯</h2>
            <div className="space-y-4 text-gray-300">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white text-black rounded-full font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Each Entry Gets a Roll</h3>
                  <p className="leading-relaxed">
                    Every entry you earn gets one random roll between 1 and 1,000. More entries = more chances to roll high.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white text-black rounded-full font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Your Best Roll Counts</h3>
                  <p className="leading-relaxed">
                    We take your <span className="text-white font-semibold">highest roll</span> from all your entries. 
                    So if you have 5 entries and roll [234, 789, 456, 123, 890], your score is 890.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white text-black rounded-full font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Highest Scores Win</h3>
                  <p className="leading-relaxed">
                    Everyone&apos;s highest roll is compared, and prizes are awarded from highest to lowest. 
                    Simple as that!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The Random Number Generator */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">The Random Number Generator 🎰</h2>
            <div className="space-y-4 text-gray-300">
              <p className="leading-relaxed">
                We use JavaScript&apos;s built-in <code className="px-2 py-1 bg-black rounded text-sm font-mono text-white">Math.random()</code> function, 
                which is powered by your browser&apos;s cryptographically secure random number generator.
              </p>
              
              <div className="bg-black border border-zinc-800 rounded-lg p-4 font-mono text-sm">
                <div className="text-gray-500">{`// The actual code used for each roll:`}</div>
                <div className="text-white mt-2">
                  const roll = Math.floor(Math.random() * 1000) + 1;
                </div>
              </div>

              <p className="leading-relaxed">
                This generates a random integer between 1 and 1,000 (inclusive). Each number has an equal 
                <span className="text-white font-semibold"> 0.1% chance</span> of being rolled.
              </p>
            </div>
          </div>

          {/* Why It&apos;s Fair */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Why It&apos;s Fair ⚖️</h2>
            <div className="space-y-4 text-gray-300">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <div>
                    <span className="font-semibold text-white">Transparent:</span> All rolls are shown publicly. 
                    You can see every single roll made by every player.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <div>
                    <span className="font-semibold text-white">Verifiable:</span> Every drawing is saved with a 
                    shareable link. Anyone can review the results at any time.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <div>
                    <span className="font-semibold text-white">No Manipulation:</span> The rolls happen in your browser 
                    using standard JavaScript. There&apos;s no server-side trickery or hidden algorithms.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <div>
                    <span className="font-semibold text-white">More Entries = Better Odds:</span> The system rewards 
                    participation. More entries give you more chances to roll that perfect 1,000.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Math */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">The Math (For the Nerds) 🤓</h2>
            <div className="space-y-4 text-gray-300">
              <p className="leading-relaxed">
                If you&apos;re curious about the probability of rolling high with multiple entries:
              </p>
              
              <div className="bg-black border border-zinc-800 rounded-lg p-4 space-y-2 text-sm">
                <div><span className="text-gray-500">1 entry:</span> <span className="text-white">0.1% chance of rolling 1000</span></div>
                <div><span className="text-gray-500">5 entries:</span> <span className="text-white">~0.5% chance of rolling 1000</span></div>
                <div><span className="text-gray-500">10 entries:</span> <span className="text-white">~1% chance of rolling 1000</span></div>
                <div><span className="text-gray-500">20 entries:</span> <span className="text-white">~2% chance of rolling 1000</span></div>
              </div>

              <p className="leading-relaxed text-sm">
                The probability of rolling at least one number ≥ X with N entries is: 
                <code className="px-2 py-1 bg-black rounded text-xs font-mono text-white ml-2">
                  1 - ((1000 - X) / 1000)^N
                </code>
              </p>
            </div>
          </div>

          {/* Still Suspicious? */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Still Suspicious? 🕵️</h2>
            <div className="space-y-4 text-gray-300">
              <p className="leading-relaxed">
                We get it. Sometimes RNG just doesn&apos;t go your way. But remember:
              </p>
              
              <ul className="space-y-2 list-disc list-inside">
                <li>Every drawing is permanently saved and publicly viewable</li>
                <li>All rolls are displayed for complete transparency</li>
                <li>The code is simple and uses standard browser APIs</li>
                <li>Everyone plays by the same rules</li>
              </ul>

              <p className="leading-relaxed mt-4">
                If you still think it&apos;s rigged... well, maybe you just need to earn more entries next month! 😉
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-8">
            <Link
              href="/drawings"
              className="inline-block px-8 py-4 bg-white text-black rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors"
            >
              View Past Drawings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
