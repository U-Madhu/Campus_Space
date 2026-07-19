import { useState } from "react";

const InterviewStructureViewer = ({ data }) => {
    if (!data) return null;

    const { selection_process, coding, core_concepts, project_related, personality_related } = data;

    const [openCodingRows, setOpenCodingRows] = useState({});
    const [openConceptRows, setOpenConceptRows] = useState({});
    const [openProjectRows, setOpenProjectRows] = useState({});
    const [openPersonalityRows, setOpenPersonalityRows] = useState({});

    const toggleCodingRow = (id) => {
        setOpenCodingRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleConceptRow = (id) => {
        setOpenConceptRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleProjectRow = (id) => {
        setOpenProjectRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const togglePersonalityRow = (id) => {
        setOpenPersonalityRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const roundLabels = {
        resume_shortlist: "Resume Shortlist",
        online_assessment: "Online Assessment (OA)",
        group_discussion: "Group Discussion (GD)",
        assignment: "Assignment",
        technical_round: "Technical Round",
        managerial_round: "Managerial Round",
        hr_round: "HR Round"
    };

    const activeRounds = selection_process?.rounds
        ? Object.keys(selection_process.rounds).filter(key => selection_process.rounds[key])
        : [];

    return (
        <div className="w-full my-10 flex flex-col gap-10 font-sans">
            {/* ========================================================================= */}
            {/* 0. SELECTION PROCESS SECTION */}
            {/* ========================================================================= */}
            <div className="bg-white border border-grey rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-grey">
                    <div>
                        <h3 className="font-bold text-xl text-black">Selection Process</h3>
                        <p className="text-xs text-dark-grey">Rounds conducted during the hiring workflow</p>
                    </div>
                    {selection_process?.na ? (
                        <span className="bg-red/20 text-red px-3 py-1 rounded-full text-xs font-bold border border-red/30">
                            N/A — No Selection Details
                        </span>
                    ) : (
                        <span className="bg-purple/10 text-purple px-3 py-1 rounded-full text-xs font-bold">
                            {activeRounds.length} Rounds Conducted
                        </span>
                    )}
                </div>

                {selection_process?.na ? (
                    <div className="py-6 text-center text-dark-grey text-sm italic">
                        No selection process details were provided.
                    </div>
                ) : (
                    <div className="mt-6 flex flex-col gap-4">
                        {activeRounds.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-2">
                                {activeRounds.map((roundKey, i) => (
                                    <div key={roundKey} className="flex items-center gap-2">
                                        <div className="bg-purple text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                            <span>✓</span>
                                            <span>{roundLabels[roundKey] || roundKey}</span>
                                        </div>
                                        {i < activeRounds.length - 1 && (
                                            <span className="text-dark-grey text-xs font-bold">→</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-xs text-dark-grey italic">No specific rounds ticked.</div>
                        )}

                        {selection_process?.notes && (
                            <div className="bg-grey/20 p-4 rounded-xl text-xs leading-relaxed text-black border border-grey/50">
                                <span className="font-bold text-purple block mb-1 uppercase tracking-wider text-[10px]">Process Notes & Guidelines:</span>
                                <p>{selection_process.notes}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* 1. CODING QUESTIONS SECTION */}
            {/* ========================================================================= */}
            <div className="bg-black/95 text-white rounded-2xl p-6 shadow-xl border border-white/10">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                    <div>
                        <h3 className="font-bold text-xl text-white tracking-wide">Coding Questions</h3>
                        <p className="text-xs text-grey">Problem statements, difficulty levels, and solution resources</p>
                    </div>
                    {coding?.na ? (
                        <span className="bg-red/20 text-red px-3 py-1 rounded-full text-xs font-bold border border-red/30">
                            N/A — No Coding Questions Asked
                        </span>
                    ) : (
                        <span className="bg-purple/20 text-purple px-3 py-1 rounded-full text-xs font-bold border border-purple/30">
                            {coding?.questions?.length || 0} Questions Asked
                        </span>
                    )}
                </div>

                {coding?.na ? (
                    <div className="py-6 text-center text-dark-grey text-sm italic">
                        No coding or technical questions were asked during this interview round.
                    </div>
                ) : coding?.questions?.length > 0 ? (
                    <div className="mt-6 flex flex-col gap-3">
                        {coding.questions.map((q, idx) => {
                            const rowId = q.id || idx;
                            const isExpanded = openCodingRows[rowId];

                            return (
                                <div key={rowId} className="border border-white/10 rounded-xl overflow-hidden bg-white/5 transition-all">
                                    {/* Problem Summary Bar */}
                                    <div
                                        className="p-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-white/10 transition-colors"
                                        onClick={() => toggleCodingRow(rowId)}
                                    >
                                        <div className="flex items-center gap-3 min-w-[200px]">
                                            <span className="w-6 h-6 rounded-full bg-white/10 text-xs flex items-center justify-center font-bold text-grey">
                                                {idx + 1}
                                            </span>
                                            <h4 className="font-semibold text-sm text-white hover:text-purple transition-colors">
                                                {q.title || `Question #${idx + 1}`}
                                            </h4>
                                        </div>

                                        <div className="flex items-center gap-3 ml-auto">
                                            {/* Difficulty Badge */}
                                            <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider ${
                                                q.difficulty === "Easy" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                                                q.difficulty === "Medium" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                                                "bg-red-500/20 text-red-400 border border-red-500/30"
                                            }`}>
                                                {q.difficulty || "Medium"}
                                            </span>

                                            {/* Practice Link Button */}
                                            {q.leetcode && (
                                                <a
                                                    href={q.leetcode}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95"
                                                    title="Practice Problem"
                                                >
                                                    <span>Practice</span>
                                                    <i className="fi fi-rr-arrow-up-right text-[10px]"></i>
                                                </a>
                                            )}

                                            {/* Video Solution Button */}
                                            {q.youtube && (
                                                <a
                                                    href={q.youtube}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95"
                                                    title="Watch Solution Video"
                                                >
                                                    <i className="fi fi-brands-youtube"></i>
                                                    <span>Video</span>
                                                </a>
                                            )}

                                            {/* Resource Link Button */}
                                            {q.resource && (
                                                <a
                                                    href={q.resource}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95"
                                                    title="Read Resource Article"
                                                >
                                                    <i className="fi fi-rr-document"></i>
                                                    <span>Article</span>
                                                </a>
                                            )}

                                            {/* Down Bar Accordion Arrow */}
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-grey hover:text-white">
                                                <i className={`fi ${isExpanded ? "fi-rr-angle-small-up" : "fi-rr-angle-small-down"} text-lg`}></i>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Down Bar Content */}
                                    {isExpanded && (
                                        <div className="p-5 bg-black/40 border-t border-white/10 flex flex-col gap-4 text-xs leading-relaxed text-grey">
                                            {q.statement && (
                                                <div>
                                                    <span className="font-bold uppercase tracking-wider text-[10px] text-purple block mb-1">Problem Statement / Question Details:</span>
                                                    <p className="bg-white/5 p-3 rounded-lg border border-white/5 text-white">{q.statement}</p>
                                                </div>
                                            )}

                                            {q.approach && (
                                                <div>
                                                    <span className="font-bold uppercase tracking-wider text-[10px] text-green-400 block mb-1">Approach & Explanation:</span>
                                                    <p className="bg-white/5 p-3 rounded-lg border border-white/5 text-white">{q.approach}</p>
                                                </div>
                                            )}

                                            {q.code && (
                                                <div>
                                                    <span className="font-bold uppercase tracking-wider text-[10px] text-amber-400 block mb-1">Code / Solution Snippet:</span>
                                                    <pre className="bg-black p-4 rounded-xl border border-white/10 overflow-x-auto text-green-300 font-mono text-xs">
                                                        <code>{q.code}</code>
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-6 text-center text-dark-grey text-sm italic">
                        No coding questions listed for this interview post.
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* 2. CORE CONCEPTS */}
            {/* ========================================================================= */}
            <div className="bg-white border border-grey rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-grey">
                    <div>
                        <h3 className="font-bold text-xl text-black">Core Concepts</h3>
                        <p className="text-xs text-dark-grey">OS, DBMS, Computer Networks, OOPs, or Core Branch subjects</p>
                    </div>
                    {core_concepts?.na ? (
                        <span className="bg-red/20 text-red px-3 py-1 rounded-full text-xs font-bold border border-red/30">
                            N/A — No Core Concepts Asked
                        </span>
                    ) : (
                        <span className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                            {core_concepts?.questions?.length || 0} Questions
                        </span>
                    )}
                </div>

                {core_concepts?.na ? (
                    <div className="py-6 text-center text-dark-grey text-sm italic">
                        No core concept / domain knowledge questions were asked in this round.
                    </div>
                ) : core_concepts?.questions?.length > 0 ? (
                    <div className="mt-6 flex flex-col gap-3">
                        {core_concepts.questions.map((c, idx) => {
                            const rowId = c.id || idx;
                            const isExpanded = openConceptRows[rowId];
                            const displayTopic = c.topic === "Other" ? (c.customTopic || "Subject") : c.topic;

                            return (
                                <div key={rowId} className="border border-grey rounded-xl overflow-hidden bg-grey/5">
                                    <div
                                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-grey/20 transition-colors"
                                        onClick={() => toggleConceptRow(rowId)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="bg-purple text-white px-2.5 py-0.5 rounded-md text-[11px] font-bold">
                                                {displayTopic || "Subject"}
                                            </span>
                                            <h4 className="font-bold text-sm text-black">
                                                {c.question || `Concept Question #${idx + 1}`}
                                            </h4>
                                        </div>
                                        <i className={`fi ${isExpanded ? "fi-rr-angle-small-up" : "fi-rr-angle-small-down"} text-lg text-dark-grey`}></i>
                                    </div>

                                    {isExpanded && (
                                        <div className="p-4 bg-white border-t border-grey text-xs leading-relaxed text-dark-grey">
                                            <p className="font-semibold text-black mb-1">Answer & Discussion:</p>
                                            <p className="bg-grey/20 p-3 rounded-lg">{c.answer || "No answer details provided."}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-6 text-center text-dark-grey text-sm italic">
                        No core concept questions listed.
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* 3. PROJECT RELATED SECTION */}
            {/* ========================================================================= */}
            <div className="bg-white border border-grey rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-grey">
                    <div>
                        <h3 className="font-bold text-xl text-black">Project Related Questions</h3>
                        <p className="text-xs text-dark-grey">Interviewer questions regarding resume projects</p>
                    </div>
                    {project_related?.na ? (
                        <span className="bg-red/20 text-red px-3 py-1 rounded-full text-xs font-bold border border-red/30">
                            N/A — No Project Questions Asked
                        </span>
                    ) : (
                        <span className="bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">
                            {project_related?.questions?.length || 0} Questions
                        </span>
                    )}
                </div>

                {project_related?.na ? (
                    <div className="py-6 text-center text-dark-grey text-sm italic">
                        No project questions were asked in this round.
                    </div>
                ) : project_related?.questions?.length > 0 ? (
                    <div className="mt-6 flex flex-col gap-3">
                        {project_related.questions.map((p, idx) => {
                            const rowId = p.id || idx;
                            const isExpanded = openProjectRows[rowId];

                            return (
                                <div key={rowId} className="border border-grey rounded-xl overflow-hidden bg-grey/5">
                                    <div
                                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-grey/20 transition-colors"
                                        onClick={() => toggleProjectRow(rowId)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {p.project && (
                                                <span className="bg-black text-white px-2.5 py-0.5 rounded-md text-[11px] font-bold">
                                                    {p.project}
                                                </span>
                                            )}
                                            <h4 className="font-bold text-sm text-black">
                                                {p.question || `Project Question #${idx + 1}`}
                                            </h4>
                                        </div>
                                        <i className={`fi ${isExpanded ? "fi-rr-angle-small-up" : "fi-rr-angle-small-down"} text-lg text-dark-grey`}></i>
                                    </div>

                                    {isExpanded && (
                                        <div className="p-4 bg-white border-t border-grey text-xs leading-relaxed text-dark-grey">
                                            <p className="font-semibold text-black mb-1">Key Highlights & Response:</p>
                                            <p className="bg-grey/20 p-3 rounded-lg">{p.answer || "No response details provided."}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-6 text-center text-dark-grey text-sm italic">
                        No project questions listed.
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* 4. PERSONALITY & HR SECTION */}
            {/* ========================================================================= */}
            <div className="bg-white border border-grey rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-grey">
                    <div>
                        <h3 className="font-bold text-xl text-black">Personality & HR Related</h3>
                        <p className="text-xs text-dark-grey">Behavioral and HR round questions</p>
                    </div>
                    {personality_related?.na ? (
                        <span className="bg-red/20 text-red px-3 py-1 rounded-full text-xs font-bold border border-red/30">
                            N/A — No HR Questions Asked
                        </span>
                    ) : (
                        <span className="bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-xs font-bold">
                            {personality_related?.questions?.length || 0} Questions
                        </span>
                    )}
                </div>

                {personality_related?.na ? (
                    <div className="py-6 text-center text-dark-grey text-sm italic">
                        No HR questions were asked in this round.
                    </div>
                ) : personality_related?.questions?.length > 0 ? (
                    <div className="mt-6 flex flex-col gap-3">
                        {personality_related.questions.map((h, idx) => {
                            const rowId = h.id || idx;
                            const isExpanded = openPersonalityRows[rowId];

                            return (
                                <div key={rowId} className="border border-grey rounded-xl overflow-hidden bg-grey/5">
                                    <div
                                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-grey/20 transition-colors"
                                        onClick={() => togglePersonalityRow(rowId)}
                                    >
                                        <h4 className="font-bold text-sm text-black">
                                            {h.question || `HR Question #${idx + 1}`}
                                        </h4>
                                        <i className={`fi ${isExpanded ? "fi-rr-angle-small-up" : "fi-rr-angle-small-down"} text-lg text-dark-grey`}></i>
                                    </div>

                                    {isExpanded && (
                                        <div className="p-4 bg-white border-t border-grey text-xs leading-relaxed text-dark-grey">
                                            <p className="font-semibold text-black mb-1">Response Strategy:</p>
                                            <p className="bg-grey/20 p-3 rounded-lg">{h.answer || "No response details provided."}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-6 text-center text-dark-grey text-sm italic">
                        No HR questions listed.
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewStructureViewer;
