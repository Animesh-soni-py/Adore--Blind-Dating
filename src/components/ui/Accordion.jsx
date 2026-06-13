import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

function AccordionItem({ question, answer, isOpen, onToggle, id }) {
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        id={`accordion-trigger-${id}`}
        aria-expanded={isOpen}
        aria-controls={`accordion-panel-${id}`}
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between py-5 px-1 text-left',
          'group transition-colors duration-200'
        )}
      >
        <span className="font-display text-lg font-bold text-white pr-4 group-hover:text-pink transition-colors italic">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-pink font-bold text-xl"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`accordion-panel-${id}`}
            role="region"
            aria-labelledby={`accordion-trigger-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 px-1 text-body text-white/60 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Accordion({ items = [], allowMultiple = false, className = '' }) {
  const [openItems, setOpenItems] = useState(new Set());

  function handleToggle(index) {
    setOpenItems((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className={cn('divide-y-0', className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          id={index}
          question={item.question}
          answer={item.answer}
          isOpen={openItems.has(index)}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}
