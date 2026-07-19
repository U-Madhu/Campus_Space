import { useState } from "react";

const InterviewStructureViewer = ({ data }) => {
    if (!data) return null;

    const { selection_process, coding, core_concepts, project_related, personality_related } = data;

    // Collapsed by default so only subheadings are shown initially
    const [isSelectionOpen, setIsSelectionOpen] = useState(false);
    const [isCodingOpen, setIsCodingOpen] = useState(false);
    const [isConceptOpen, setIsConceptOpen] = useState(false);
    const [isProjectOpen, setIsProjectOpen] = useState(false);
    const [isPersonalityOpen, setIsPersonalityOpen] = useState(false);

    // Question-level Down-Bar Accordion States
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
        <div className="w-full my-8 flex flex-col gap-4 font-sans">
            {/* ========================================================================= */}
            {/* 0. SELECTION PROCESS SECTION */}
            {/* ========================================================================= */}
            <div className="bg-white border border-grey rounded-2xl overflow-hidden shadow-sm transition-all">
                {/* Down Bar Section Header */}
                <div
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-grey/20 transition-colors select-none"
                    onClick={() => setIsSelectionOpen(!isSelectionOpen)}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-grey flex items-center justify-center text-dark-grey">
                            <i className={`fi ${isSelectionOpen ? "fi-rr-angle-small-up" : "fi-rr-angle-small-down"} text-lg`}></i>
                        </div>
                        <h3 className="font-bold text-lg text-black tracking-tight font-sans">Selection Process</h3>
                    </div>

                    {selection_process?.na ? (
                        <span className="bg-grey text-dark-grey px-3 py-1 rounded-full text-xs font-medium border border-grey font-sans whitespace-nowrap">
                            N/A
                        </span>
                    ) : (
                        <span className="bg-grey text-black px-3.5 py-1 rounded-full text-xs font-bold border border-grey font-sans whitespace-nowrap">
                            {activeRounds.length} Rounds
                        </span>
                    )}
                </div>

                {/* Down Bar Content */}
                {isSelectionOpen && (
                    <div className="p-5 pt-2 border-t border-grey bg-white">
                        {selection_process?.na ? (
                            <div className="py-3 text-center text-dark-grey text-xs italic font-sans">
                                No selection process details were provided.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {activeRounds.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {activeRounds.map((roundKey, i) => (
                                            <div
                                                key={roundKey}
                                                className="flex items-center gap-3 p-3 px-4 bg-grey/20 border border-grey/60 rounded-xl hover:border-purple/30 transition-all font-sans"
                                            >
                                                <span className="w-5 h-5 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center flex-none font-sans">
                                                    {i + 1}
                                                </span>
                                                <span className="font-semibold text-xs text-black font-sans">
                                                    {roundLabels[roundKey] || roundKey}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs text-dark-grey italic font-sans">No specific rounds ticked.</div>
                                )}

                                {selection_process?.notes && (
                                    <div className="bg-grey/30 p-3.5 rounded-xl text-xs leading-relaxed text-black border border-grey/60 mt-1 font-sans">
                                        <span className="font-bold text-black block mb-1 uppercase tracking-wider text-[10px] font-sans">Process Notes:</span>
                                        <p className="text-dark-grey font-sans">{selection_process.notes}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* 1. CODING QUESTIONS SECTION */}
            {/* ========================================================================= */}
            <div className="bg-white border border-grey rounded-2xl overflow-hidden shadow-sm transition-all">
                {/* Down Bar Section Header */}
                <div
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-grey/20 transition-colors select-none"
                    onClick={() => setIsCodingOpen(!isCodingOpen)}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-grey flex items-center justify-center text-dark-grey">
                            <i className={`fi ${isCodingOpen ? "fi-rr-angle-small-up" : "fi-rr-angle-small-down"} text-lg`}></i>
                        </div>
                        <h3 className="font-bold text-lg text-black tracking-tight font-sans">Coding Questions</h3>
                    </div>

                    {coding?.na ? (
                        <span className="bg-grey text-dark-grey px-3 py-1 rounded-full text-xs font-medium border border-grey font-sans whitespace-nowrap">
                            N/A
                        </span>
                    ) : (
                        <span className="bg-grey text-black px-3.5 py-1 rounded-full text-xs font-bold border border-grey font-sans whitespace-nowrap">
                            {coding?.questions?.length || 0} Questions
                        </span>
                    )}
                </div>

                {/* Down Bar Content */}
                {isCodingOpen && (
                    <div className="p-5 pt-2 border-t border-grey bg-white">
                        {coding?.na ? (
                            <div className="py-3 text-center text-dark-grey text-xs italic font-sans">
                                No coding or technical questions were asked during this interview round.
                            </div>
                        ) : coding?.questions?.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {coding.questions.map((q, idx) => {
                                    const rowId = q.id || idx;
                                    const isExpanded = openCodingRows[rowId];

                                    return (
                                        <div key={rowId} className="border border-grey rounded-xl overflow-hidden bg-white hover:border-purple/30 transition-all font-sans">
                                            {/* Problem Summary Bar */}
                                            <div
                                                className="p-3.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-grey/20 transition-colors"
                                                onClick={() => toggleCodingRow(rowId)}
                                            >
                                                <div className="flex items-center gap-3 min-w-[200px]">
                                                    <span className="w-5 h-5 rounded-full bg-grey text-[11px] flex items-center justify-center font-bold text-black font-sans">
                                                        {idx + 1}
                                                    </span>
                                                    <h4 className="font-bold text-xs text-black hover:text-purple transition-colors font-sans">
                                                        {q.title || `Question #${idx + 1}`}
                                                    </h4>
                                                </div>

                                                <div className="flex items-center gap-2.5 ml-auto">
                                                    {/* Difficulty Badge */}
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider font-sans ${
                                                        q.difficulty === "Easy" ? "bg-green-50 text-green-700 border border-green-200" :
                                                        q.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                                        "bg-red-50 text-red-700 border border-red-200"
                                                    }`}>
                                                        {q.difficulty || "Easy"}
                                                    </span>

                                                    {/* Practice Link Button */}
                                                    {q.leetcode && (
                                                        <a
                                                            href={q.leetcode}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="bg-grey hover:bg-black hover:text-white text-black px-2.5 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all active:scale-95 border border-grey font-sans"
                                                            title="Practice Problem"
                                                        >
                                                            <span>Practice</span>
                                                            <i className="fi fi-rr-arrow-up-right text-[9px]"></i>
                                                        </a>
                                                    )}

                                                    {/* Video Solution Button */}
                                                    {q.youtube && (
                                                        <a
                                                            href={q.youtube}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all active:scale-95 border border-red-100 font-sans"
                                                            title="Watch Solution Video"
                                                        >
                                                            <i className="fi fi-brands-youtube text-[10px]"></i>
                                                            <span>Video</span>
                                                        </a>
                                                    )}

                                                    {/* Down Bar Accordion Arrow */}
                                                    <div className="w-6 h-6 rounded-full bg-grey flex items-center justify-center text-dark-grey hover:text-black">
                                                        <i className={`fi ${isExpanded ? "fi-rr-angle-small-up" : "fi-rr-angle-small-down"} text-base`}></i>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Down Bar Content */}
                                            {isExpanded && (
                                                <div className="p-4 bg-grey/10 border-t border-grey flex flex-col gap-3 text-xs leading-relaxed text-black font-sans">
                                                    {q.statement && (
                                                        <div>
                                                            <span className="font-bold uppercase tracking-wider text-[10px] text-purple block mb-1 font-sans">Problem Details:</span>
                                                            <p className="bg-white p-3 rounded-lg border border-grey text-black font-sans">{q.statement}</p>
                                                        </div>
                                                    )}

                                                    {q.approach && (
                                                        <div>
                                                            <span className="font-bold uppercase tracking-wider text-[10px] text-black block mb-1 font-sans">Approach & Explanation:</span>
                                                            <p className="bg-white p-3 rounded-lg border border-grey text-black font-sans">{q.approach}</p>
                                                        </div>
                                                    )}

                                                    {q.code && (
                                                        <div>
                                                            <span className="font-bold uppercase tracking-wider text-[10px] text-dark-grey block mb-1 font-sans">Code Snippet:</span>
                                                            <pre className="bg-black text-white p-3.5 rounded-xl border border-grey overflow-x-auto font-mono text-xs">
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
                            <div className="py-3 text-center text-dark-grey text-xs italic font-sans">
                                No coding questions listed for this interview post.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* 2. CORE CONCEPTS SECTION */}
            {/* ========================================================================= */}
            <div className="bg-white border border-grey rounded-2xl overflow-hidden shadow-sm transition-all">
                {/* Down Bar Section Header */}
                <div
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-grey/20 transition-colors select-none"
                    onClick={() => setIsConceptOpen(!isConceptOpen)}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-grey flex items-center justify-center text-dark-grey">
                            <i className={`fi ${isConceptOpen ? "fi-rr-angle-small-up" : "fi-rr-angle-small-down"} text-lg`}></i>
                        </div>
                        <h3 className="font-bold text-lg text-black tracking-tight font-sans">Core Concepts</h3>
                    </div>

                    {core_concepts?.na ? (
                        <span className="bg-grey text-dark-grey px-3 py-1 rounded-full text-xs font-medium border border-grey font-sans whitespace-nowrap">
                            N/A
                        </span>
                    ) : (
                        <span className="bg-grey text-black px-3.5 py-1 rounded-full text-xs font-bold border border-grey font-sans whitespace-nowrap">
                            {core_concepts?.questions?.length || 0} Questions
                        </span>
                    )}
                </div>

                {/* Down Bar Content */}
                {isConceptOpen && (
                    <div className="p-5 pt-2 border-t border-grey bg-white">
                        {core_concepts?.na ? (
                            <div className="py-3 text-center text-dark-grey text-xs italic font-sans">
                                No core concept questions were asked in this round.
                            </div>
                        ) : core_concepts?.questions?.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {core_concepts.questions.map((c, idx) => {
                                    const rowId = c.id || idx;
                                    const isExpanded = openConceptRows[rowId];
                                    const displayTopic = c.topic === "Other" ? (c.customTopic || "Subject") : c.topic;

                                    return (
                                        <div key={rowId} className="border border-grey rounded-xl overflow-hidden bg-white hover:border-purple/30 transition-all font-sans">
                                            <div
                                                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-grey/20 transition-colors"
                                                onClick={() => toggleConceptRow(rowId)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-grey text-black border border-grey px-2 py-0.5 rounded-md text-[11px] font-bold font-sans">
                                                        {displayTopic || "Subject"}
                                                    </span>
                                                    <h4 className="font-bold text-xs text-black font-sans">
                                                        {c.question || `Concept Question #${idx + 1}`}
                                                    </h4>
                                                </div>
                                                <i className={`fi ${isExpanded ? "fi-rr-angle-small-up" : "fi-rr-angle-small-down"} text-base text-dark-grey`}></i>
                                            </div>

                                            {isExpanded && (
                                                <div className="p-4 bg-grey/10 border-t border-grey text-xs leading-relaxed text-black font-sans">
                                                    <p className="font-bold text-black mb-1 font-sans">Answer & Discussion:</p>
                                                    <p className="bg-white p-3 rounded-lg border border-grey font-sans">{c.answer || "No answer details provided."}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-3 text-center text-dark-grey text-xs italic font-sans">
                                No core concept questions listed for this interview post.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* 3. PROJECT RELATED QUESTIONS SECTION */}
            {/* ========================================================================= */}
            <div className="bg-white border border-grey rounded-2xl overflow-hidden shadow-sm transition-all">
                {/* Down Bar Section Header */}
                <div
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-grey/20 transition-colors select-none"
                    onClick={() => setIsProjectOpen(!isProjectOpen)}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-grey flex items-center justify-center text-dark-grey">
                            <i className={`fi ${isProjectOpen ? "fi-rr-angle-small-up" : "fi-rr-angle-small-down"} text-lg`}></i>
                        </div>
                        <h3 className="font-bold text-lg text-black tracking-tight font-sans">Project Related Questions</h3>
                    </div>

                    {project_related?.na ? (
                        <span className="bg-grey text-dark-grey px-3 py-1 rounded-full text-xs font-medium border border-grey font-sans whitespace-nowrap">
                            N/A
                        </span>
                    ) : (
                        <span className="bg-grey text-black px-3.5 py-1 rounded-full text-xs font-bold border border-grey font-sans whitespace-nowrap">
                            {project_related?.questions?.length || 0} Questions
                        </span>
                    )}
                </div>

                {/* Down Bar Content */}
                {isProjectOpen && (
                    <div className="p-5 pt-2 border-t border-grey bg-white">
                        {project_related?.na ? (
                            <div className="py-3 text-center text-dark-grey text-xs italic font-sans">
                                No project-specific questions were asked.
                            </div>
                        ) : project_related?.questions?.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {project_related.questions.map((p, idx) => {
                                    const rowId = p.id || idx;
                                    const isExpanded = openProjectRows[rowId];

                                    return (
                                        <div key={rowId} className="border border-grey rounded-xl overflow-hidden bg-white hover:border-purple/30 transition-all font-sans">
                                            <div
                                                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-grey/20 transition-colors"
                                                onClick={() => toggleProjectRow(rowId)}
                                            >
                                                <h4 className="font-bold text-xs text-black font-sans">
                                                    {p.question || `Project Question #${idx + 1}`}
                                                </h4>
                                                <i className={`fi ${isExpanded ? "fi-rr-angle-small-up" : "fi-rr-angle-small-down"} text-base text-dark-grey`}></i>
                                            </div>

                                            {isExpanded && (
                                                <div className="p-4 bg-grey/10 border-t border-grey text-xs leading-relaxed text-black font-sans">
                                                    <p className="font-bold text-black mb-1 font-sans">Answer & Details:</p>
                                                    <p className="bg-white p-3 rounded-lg border border-grey font-sans">{p.answer || "No answer details provided."}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-3 text-center text-dark-grey text-xs italic font-sans">
                                No project questions listed.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* 4. HR & PERSONALITY ROUND QUESTIONS SECTION */}
            {/* ========================================================================= */}
            <div className="bg-white border border-grey rounded-2xl overflow-hidden shadow-sm transition-all">
                {/* Down Bar Section Header */}
                <div
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-grey/20 transition-colors select-none"
                    onClick={() => setIsPersonalityOpen(!isPersonalityOpen)}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-grey flex items-center justify-center text-dark-grey">
                            <i className={`fi ${isPersonalityOpen ? "fi-rr-angle-small-up" : "fi-rr-angle-small-down"} text-lg`}></i>
                        </div>
                        <h3 className="font-bold text-lg text-black tracking-tight font-sans">HR & Behavioral Questions</h3>
                    </div>

                    {personality_related?.na ? (
                        <span className="bg-grey text-dark-grey px-3 py-1 rounded-full text-xs font-medium border border-grey font-sans whitespace-nowrap">
                            N/A
                        </span>
                    ) : (
                        <span className="bg-grey text-black px-3.5 py-1 rounded-full text-xs font-bold border border-grey font-sans whitespace-nowrap">
                            {personality_related?.questions?.length || 0} Questions
                        </span>
                    )}
                </div>

                {/* Down Bar Content */}
                {isPersonalityOpen && (
                    <div className="p-5 pt-2 border-t border-grey bg-white">
                        {personality_related?.na ? (
                            <div className="py-3 text-center text-dark-grey text-xs italic font-sans">
                                No HR or behavioral questions were asked.
                            </div>
                        ) : personality_related?.questions?.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {personality_related.questions.map((pr, idx) => {
                                    const rowId = pr.id || idx;
                                    const isExpanded = openPersonalityRows[rowId];

                                    return (
                                        <div key={rowId} className="border border-grey rounded-xl overflow-hidden bg-white hover:border-purple/30 transition-all font-sans">
                                            <div
                                                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-grey/20 transition-colors"
                                                onClick={() => togglePersonalityRow(rowId)}
                                            >
                                                <h4 className="font-bold text-xs text-black font-sans">
                                                    {pr.question || `HR Question #${idx + 1}`}
                                                </h4>
                                                <i className={`fi ${isExpanded ? "fi-rr-angle-small-up" : "fi-rr-angle-small-down"} text-base text-dark-grey`}></i>
                                            </div>

                                            {isExpanded && (
                                                <div className="p-4 bg-grey/10 border-t border-grey text-xs leading-relaxed text-black font-sans">
                                                    <p className="font-bold text-black mb-1 font-sans">Answer & Strategy:</p>
                                                    <p className="bg-white p-3 rounded-lg border border-grey font-sans">{pr.answer || "No answer details provided."}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-3 text-center text-dark-grey text-xs italic font-sans">
                                No HR questions listed.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewStructureViewer;
