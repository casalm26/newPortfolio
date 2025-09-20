"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import timelineData from "@/data/cv/timeline.json";
import { motion, AnimatePresence } from "framer-motion";
import { useVisualFeedback } from "@/lib/visual-feedback";
import ScrollAnimation from "@/components/shared/ScrollAnimation";

interface TimelineItem {
  id: string;
  type:
    | "work"
    | "education"
    | "skill"
    | "personal"
    | "certification"
    | "project";
  title: string;
  company?: string;
  institution?: string;
  category?: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  description: string;
  responsibilities?: string[];
  details?: string[];
  skills?: string[];
  achievements?: string[];
  level?: string;
  yearsOfExperience?: number;
  impact?: string;
  issuer?: string;
  credentialId?: string;
  links?: Record<string, string>;
}

interface TimelineNodeProps {
  item: TimelineItem;
  isExpanded: boolean;
  onToggle: () => void;
  position: number;
}

function TimelineNode({
  item,
  isExpanded,
  onToggle,
  position,
}: TimelineNodeProps) {
  const category = timelineData.categories[item.type];
  const isLeft = position % 2 === 0;
  const feedback = useVisualFeedback();

  const getIcon = () => {
    switch (item.type) {
      case "work":
        return "💼";
      case "education":
        return "🎓";
      case "skill":
        return "⚡";
      case "personal":
        return "🌟";
      case "certification":
        return "📋";
      case "project":
        return "🚀";
      default:
        return "●";
    }
  };

  return (
    <ScrollAnimation variant="slideInFromLeft" delay={position * 0.1}>
      <div
        className={cn(
          "flex items-center mb-8",
          isLeft ? "flex-row" : "flex-row-reverse",
        )}
      >
      {/* Content Card */}
      <motion.div
        className={cn(
          "w-80 p-4 border border-terminal-400 cursor-pointer transition-all duration-200",
          isExpanded
            ? "border-white bg-terminal-900 shadow-[4px_4px_0px_#ffffff]"
            : "hover:border-terminal-300 hover:shadow-[2px_2px_0px_#a1a1aa] hover:translate-x-[-1px] hover:translate-y-[-1px]",
          isLeft ? "mr-8" : "ml-8",
        )}
        onClick={() => {
          onToggle();
          feedback.click();
        }}
        onMouseEnter={() => feedback.hover()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        layout
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-pixel text-xs text-terminal-400 uppercase">
            {item.type}
          </span>
          <span className="font-pixel text-xs text-terminal-500">
            {item.startDate} {item.endDate && `- ${item.endDate}`}
            {item.current && " - present"}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>

        {(item.company || item.institution) && (
          <p className="text-terminal-300 text-sm mb-2">
            {item.company || item.institution}
            {item.location && ` • ${item.location}`}
          </p>
        )}

        <p className="text-terminal-400 text-sm line-clamp-2">
          {item.description}
        </p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="mt-4 space-y-3"
            >
            {item.responsibilities && (
              <div>
                <h4 className="font-pixel text-xs text-terminal-400 uppercase mb-2">
                  Key Responsibilities
                </h4>
                <ul className="space-y-1">
                  {item.responsibilities.map((resp, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="text-sm text-terminal-300 flex items-start"
                    >
                      <span className="text-terminal-500 mr-2">•</span>
                      {resp}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {item.achievements && (
              <div>
                <h4 className="font-pixel text-xs text-terminal-400 uppercase mb-2">
                  Achievements
                </h4>
                <ul className="space-y-1">
                  {item.achievements.map((achievement, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-terminal-300 flex items-start"
                    >
                      <span className="text-terminal-500 mr-2">✓</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.details && (
              <div>
                <h4 className="font-pixel text-xs text-terminal-400 uppercase mb-2">
                  Details
                </h4>
                <ul className="space-y-1">
                  {item.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-terminal-300 flex items-start"
                    >
                      <span className="text-terminal-500 mr-2">→</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.skills && (
              <div>
                <h4 className="font-pixel text-xs text-terminal-400 uppercase mb-2">
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-pixel text-xs px-2 py-1 border border-terminal-500 text-terminal-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.links && (
              <div>
                <h4 className="font-pixel text-xs text-terminal-400 uppercase mb-2">
                  Links
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(item.links).map(([key, url]) => (
                    <motion.a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => feedback.click()}
                      onMouseEnter={() => feedback.hover()}
                      className="font-pixel text-xs px-2 py-1 border border-terminal-400 text-terminal-300 hover:border-white hover:text-white hover:shadow-[2px_2px_0px_#ffffff] transition-all duration-150"
                    >
                      {key.toUpperCase()}
                    </motion.a>
                  ))}
                </div>
              </div>
            )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-3 font-pixel text-xs text-terminal-500">
          {isExpanded ? "▼ click to collapse" : "▶ click to expand"}
        </div>
      </motion.div>

      {/* Timeline Node */}
      <div className="flex flex-col items-center">
        <motion.div
          className={cn(
            "w-4 h-4 border-2 border-white flex items-center justify-center font-bold text-xs cursor-pointer transition-all duration-200",
            isExpanded ? "bg-white text-black shadow-[2px_2px_0px_#000000]" : "bg-black text-white hover:shadow-[2px_2px_0px_#ffffff]",
          )}
          onClick={() => {
            onToggle();
            feedback.click();
          }}
          onMouseEnter={() => feedback.hover()}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          animate={isExpanded ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          {getIcon()}
        </motion.div>
        {position < timelineData.timeline.length - 1 && (
          <motion.div
            className="w-0.5 h-8 bg-terminal-400 mt-2"
            initial={{ height: 0 }}
            animate={{ height: 32 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
        )}
      </div>

      {/* Empty space for opposite side */}
      <div className="w-80" />
      </div>
    </ScrollAnimation>
  );
}

export function CVTimeline() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>("all");
  const feedback = useVisualFeedback();

  const filteredItems = timelineData.timeline.filter(
    (item) => filter === "all" || item.type === filter,
  );

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const availableTypes = Array.from(
    new Set(timelineData.timeline.map((item) => item.type)),
  );

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="mb-8">
        <div className="font-pixel text-xs text-terminal-400 mb-3">
          filter timeline:
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            onClick={() => {
              setFilter("all");
              feedback.click();
            }}
            onMouseEnter={() => feedback.hover()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "font-pixel text-xs px-3 py-2 border transition-all duration-150",
              filter === "all"
                ? "border-white bg-white text-black shadow-[2px_2px_0px_#000000]"
                : "border-terminal-400 text-terminal-300 hover:border-white hover:text-white hover:shadow-[2px_2px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px]",
            )}
          >
            ALL ({timelineData.timeline.length})
          </motion.button>
          {availableTypes.map((type) => {
            const count = timelineData.timeline.filter(
              (item) => item.type === type,
            ).length;
            const category = timelineData.categories[type];
            return (
              <motion.button
                key={type}
                onClick={() => {
                  setFilter(type);
                  feedback.click();
                }}
                onMouseEnter={() => feedback.hover()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "font-pixel text-xs px-3 py-2 border transition-all duration-150",
                  filter === type
                    ? "border-white bg-white text-black shadow-[2px_2px_0px_#000000]"
                    : "border-terminal-400 text-terminal-300 hover:border-white hover:text-white hover:shadow-[2px_2px_0px_#ffffff] hover:translate-x-[-1px] hover:translate-y-[-1px]",
                )}
              >
                {category.label.toUpperCase()} ({count})
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto">
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-0.5 w-0.5 h-full bg-terminal-400" />

        {/* Timeline Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="space-y-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredItems.map((item, index) => (
              <TimelineNode
                key={item.id}
                item={item as TimelineItem}
                isExpanded={expandedItems.has(item.id)}
                onToggle={() => toggleExpanded(item.id)}
                position={index}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stats Footer */}
      <div className="mt-12 pt-8 border-t border-terminal-400">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="font-pixel text-2xl text-white">
              {
                timelineData.timeline.filter((item) => item.type === "work")
                  .length
              }
            </div>
            <div className="font-pixel text-xs text-terminal-400">
              WORK EXPERIENCE
            </div>
          </div>
          <div className="text-center">
            <div className="font-pixel text-2xl text-white">
              {
                timelineData.timeline.filter((item) => item.type === "skill")
                  .length
              }
            </div>
            <div className="font-pixel text-xs text-terminal-400">SKILLS</div>
          </div>
          <div className="text-center">
            <div className="font-pixel text-2xl text-white">
              {
                timelineData.timeline.filter((item) => item.type === "project")
                  .length
              }
            </div>
            <div className="font-pixel text-xs text-terminal-400">PROJECTS</div>
          </div>
          <div className="text-center">
            <div className="font-pixel text-2xl text-white">
              {
                timelineData.timeline.filter(
                  (item) => item.type === "certification",
                ).length
              }
            </div>
            <div className="font-pixel text-xs text-terminal-400">
              CERTIFICATIONS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
