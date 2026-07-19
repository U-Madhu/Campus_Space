import { useState } from "react";

const createDefaultStructure = () => ({
    selection_process: {
        na: false,
        rounds: {
            resume_shortlist: false,
            online_assessment: false,
            group_discussion: false,
            assignment: false,
            technical_round: false,
            managerial_round: false,
            hr_round: false
        },
        notes: ""
    },
    coding: {
        na: false,
        questions: []
    },
    core_concepts: {
        na: false,
        questions: []
    },
    project_related: {
        na: false,
        questions: []
    },
    personality_related: {
        na: false,
        questions: []
    }
});

const InterviewStructureEditor = ({ data, onChange }) => {
    const structure = data || createDefaultStructure();
    const [isSelectionOpen, setIsSelectionOpen] = useState(true);

    const updateSection = (sectionKey, newSectionData) => {
        onChange({
            ...structure,
            [sectionKey]: newSectionData
        });
    };

    const toggleNA = (sectionKey) => {
        const currentSection = structure[sectionKey] || { na: false };
        updateSection(sectionKey, {
            ...currentSection,
            na: !currentSection.na
        });
    };

    // Selection Process Handlers
    const toggleRound = (roundKey) => {
        const currentSelection = structure.selection_process || {
            na: false,
            rounds: {
                resume_shortlist: false,
                online_assessment: false,
                group_discussion: false,
                assignment: false,
                technical_round: false,
                managerial_round: false,
                hr_round: false
            },
            notes: ""
        };

        const updatedRounds = {
            ...currentSelection.rounds,
            [roundKey]: !currentSelection.rounds?.[roundKey]
        };

        updateSection("selection_process", {
            ...currentSelection,
            na: false,
            rounds: updatedRounds
        });
    };

    const updateSelectionNotes = (notesValue) => {
        const currentSelection = structure.selection_process || { na: false, rounds: {}, notes: "" };
        updateSection("selection_process", {
            ...currentSelection,
            notes: notesValue
        });
    };

    // 1. Coding Questions handlers
    const addCodingQuestion = () => {
        const current = structure.coding || { na: false, questions: [] };
        const newQuestion = {
            id: Date.now().toString(),
            title: "",
            difficulty: "Easy",
            leetcode: "",
            youtube: "",
            resource: "",
            statement: "",
            approach: "",
            code: "",
            isOpen: true
        };
        updateSection("coding", {
            ...current,
            na: false,
            questions: [...current.questions, newQuestion]
        });
    };

    const updateCodingQuestion = (index, field, value) => {
        const current = structure.coding;
        const updatedQuestions = [...current.questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value
        };
        updateSection("coding", { ...current, questions: updatedQuestions });
    };

    const removeCodingQuestion = (index) => {
        const current = structure.coding;
        const updatedQuestions = current.questions.filter((_, i) => i !== index);
        updateSection("coding", { ...current, questions: updatedQuestions });
    };

    // 2. Core Concepts handlers
    const addCoreConcept = () => {
        const current = structure.core_concepts || { na: false, questions: [] };
        const newQuestion = {
            id: Date.now().toString(),
            topic: "OS",
            customTopic: "",
            question: "",
            answer: "",
            isOpen: true
        };
        updateSection("core_concepts", {
            ...current,
            na: false,
            questions: [...current.questions, newQuestion]
        });
    };

    const updateCoreConcept = (index, field, value) => {
        const current = structure.core_concepts;
        const updatedQuestions = [...current.questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value
        };
        updateSection("core_concepts", { ...current, questions: updatedQuestions });
    };

    const removeCoreConcept = (index) => {
        const current = structure.core_concepts;
        const updatedQuestions = current.questions.filter((_, i) => i !== index);
        updateSection("core_concepts", { ...current, questions: updatedQuestions });
    };

    // 3. Project Related handlers
    const addProjectQuestion = () => {
        const current = structure.project_related || { na: false, questions: [] };
        const newQuestion = {
            id: Date.now().toString(),
            project: "",
            question: "",
            answer: "",
            isOpen: true
        };
        updateSection("project_related", {
            ...current,
            na: false,
            questions: [...current.questions, newQuestion]
        });
    };

    const updateProjectQuestion = (index, field, value) => {
        const current = structure.project_related;
        const updatedQuestions = [...current.questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value
        };
        updateSection("project_related", { ...current, questions: updatedQuestions });
    };

    const removeProjectQuestion = (index) => {
        const current = structure.project_related;
        const updatedQuestions = current.questions.filter((_, i) => i !== index);
        updateSection("project_related", { ...current, questions: updatedQuestions });
    };

    // 4. Personality / HR handlers
    const addPersonalityQuestion = () => {
        const current = structure.personality_related || { na: false, questions: [] };
        const newQuestion = {
            id: Date.now().toString(),
            question: "",
            answer: "",
            isOpen: true
        };
        updateSection("personality_related", {
            ...current,
            na: false,
            questions: [...current.questions, newQuestion]
        });
    };

    const updatePersonalityQuestion = (index, field, value) => {
        const current = structure.personality_related;
        const updatedQuestions = [...current.questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value
        };
        updateSection("personality_related", { ...current, questions: updatedQuestions });
    };

    const removePersonalityQuestion = (index) => {
        const current = structure.personality_related;
        const updatedQuestions = current.questions.filter((_, i) => i !== index);
        updateSection("personality_related", { ...current, questions: updatedQuestions });
    };

    const roundList = [
        { key: "resume_shortlist", label: "Resume Shortlist" },
        { key: "online_assessment", label: "Online Assessment (OA)" },
        { key: "group_discussion", label: "Group Discussion (GD)" },
        { key: "assignment", label: "Assignment / Take-home Task" },
        { key: "technical_round", label: "Technical Round" },
        { key: "managerial_round", label: "Managerial Round" },
        { key: "hr_round", label: "HR Round" }
    ];

    const currentSelectionRounds = structure.selection_process?.rounds || {};

    return (
        <div className="w-full my-8 flex flex-col gap-10 font-sans">
            {/* Header info text */}
            <div className="bg-purple/5 p-4 rounded-xl border border-purple/20 text-center">
                <p className="text-xs font-semibold text-dark-grey">
                    Fill in the predefined sections below. Use the N/A button if a section was not asked in your interview.
                </p>
            </div>

            {/* SECTION 0: SELECTION PROCESS */}
            <div className="bg-white border border-grey rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-grey">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsSelectionOpen(!isSelectionOpen)}>
                        <i className={`fi ${isSelectionOpen ? "fi-rr-angle-small-down" : "fi-rr-angle-small-right"} text-2xl text-purple`}></i>
                        <div>
                            <h3 className="font-bold text-xl text-black">Selection Process</h3>
                            <p className="text-xs text-dark-grey">Tick the interview rounds that were part of your selection process.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => toggleNA("selection_process")}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                structure.selection_process?.na
                                    ? "bg-red/20 text-red border border-red/30"
                                    : "bg-grey text-dark-grey hover:bg-grey/80"
                            }`}
                        >
                            {structure.selection_process?.na ? "N/A (No Selection Details)" : "Mark as N/A"}
                        </button>
                    </div>
                </div>

                {structure.selection_process?.na ? (
                    <div className="p-4 my-4 bg-grey/30 rounded-xl text-center text-xs text-dark-grey font-medium">
                        Marked as N/A — No Selection Process details provided.
                    </div>
                ) : isSelectionOpen && (
                    <div className="flex flex-col gap-6 mt-6">
                        <div>
                            <label className="text-xs font-bold text-dark-grey block mb-3 uppercase tracking-wider">
                                Check the rounds conducted:
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {roundList.map((round) => {
                                    const isChecked = currentSelectionRounds[round.key] || false;

                                    return (
                                        <button
                                            key={round.key}
                                            type="button"
                                            onClick={() => toggleRound(round.key)}
                                            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                                                isChecked
                                                    ? "bg-purple text-white border-purple shadow-sm"
                                                    : "bg-grey/20 text-black border-grey hover:bg-grey/40"
                                            }`}
                                        >
                                            <span>{round.label}</span>
                                            <span className={`w-5 h-5 rounded-md flex items-center justify-center border text-[10px] ${
                                                isChecked ? "bg-white text-purple border-white" : "border-dark-grey/40"
                                            }`}>
                                                {isChecked ? "✓" : ""}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-dark-grey block mb-1">
                                Additional Notes on Selection Process (Optional)
                            </label>
                            <textarea
                                value={structure.selection_process?.notes || ""}
                                onChange={(e) => updateSelectionNotes(e.target.value)}
                                placeholder="e.g. Resume shortlist cut-off CGPA was 8.0, followed by a 90 min OA with 2 DSA problems and 20 MCQs..."
                                rows="2"
                                className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple resize-none"
                            ></textarea>
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION 1: CODING QUESTIONS */}
            <div className="bg-white border border-grey rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-grey">
                    <div>
                        <h3 className="font-bold text-xl text-black">1. Coding Questions</h3>
                        <p className="text-xs text-dark-grey">Add problem statements, difficulty, LeetCode, and solution video links.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => toggleNA("coding")}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                structure.coding?.na
                                    ? "bg-red/20 text-red border border-red/30"
                                    : "bg-grey text-dark-grey hover:bg-grey/80"
                            }`}
                        >
                            {structure.coding?.na ? "N/A (No Coding Questions)" : "Mark as N/A"}
                        </button>
                        {!structure.coding?.na && (
                            <button
                                type="button"
                                onClick={addCodingQuestion}
                                className="bg-purple text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-purple/90 transition-transform active:scale-95"
                            >
                                <i className="fi fi-rr-plus"></i> Add Question
                            </button>
                        )}
                    </div>
                </div>

                {structure.coding?.na ? (
                    <div className="p-4 my-4 bg-grey/30 rounded-xl text-center text-xs text-dark-grey font-medium">
                        Marked as N/A — No Coding Questions asked in this round.
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mt-6">
                        {structure.coding?.questions?.length === 0 && (
                            <p className="text-xs text-dark-grey italic text-center py-4">No questions added yet. Click "+ Add Question" to begin.</p>
                        )}
                        {structure.coding?.questions?.map((q, i) => (
                            <div key={q.id || i} className="border border-grey rounded-xl overflow-hidden bg-grey/10">
                                <div
                                    className="p-4 bg-grey/30 flex items-center justify-between cursor-pointer hover:bg-grey/40"
                                    onClick={() => updateCodingQuestion(i, "isOpen", !q.isOpen)}
                                >
                                    <div className="flex items-center gap-3 font-semibold text-sm">
                                        <i className={`fi ${q.isOpen ? "fi-rr-angle-small-down" : "fi-rr-angle-small-right"} text-lg text-purple`}></i>
                                        <span>Problem #{i + 1}: {q.title || "Untitled Problem"}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                                            q.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                                            q.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                                        }`}>
                                            {q.difficulty}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeCodingQuestion(i); }}
                                        className="text-red text-sm hover:scale-110 p-1"
                                    >
                                        <i className="fi fi-rr-trash"></i>
                                    </button>
                                </div>

                                {q.isOpen && (
                                    <div className="p-5 flex flex-col gap-4 bg-white border-t border-grey">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="text-xs font-bold text-dark-grey block mb-1">Problem / Question Title</label>
                                                <input
                                                    type="text"
                                                    value={q.title}
                                                    onChange={(e) => updateCodingQuestion(i, "title", e.target.value)}
                                                    placeholder="e.g. Print all Nodes at Distance K in Binary Tree"
                                                    className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-dark-grey block mb-1">Difficulty</label>
                                                <select
                                                    value={q.difficulty}
                                                    onChange={(e) => updateCodingQuestion(i, "difficulty", e.target.value)}
                                                    className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple"
                                                >
                                                    <option value="Easy">Easy</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Hard">Hard</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-dark-grey block mb-1">Practice Link (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={q.leetcode}
                                                    onChange={(e) => updateCodingQuestion(i, "leetcode", e.target.value)}
                                                    placeholder="https://leetcode.com/problems/..."
                                                    className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-dark-grey block mb-1">Video Link (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={q.youtube}
                                                    onChange={(e) => updateCodingQuestion(i, "youtube", e.target.value)}
                                                    placeholder="https://youtube.com/watch?v=..."
                                                    className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-dark-grey block mb-1">Article / Resource Link (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={q.resource}
                                                    onChange={(e) => updateCodingQuestion(i, "resource", e.target.value)}
                                                    placeholder="https://takeuforward.org/..."
                                                    className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-dark-grey block mb-1">Problem Statement / Question Details</label>
                                            <textarea
                                                value={q.statement}
                                                onChange={(e) => updateCodingQuestion(i, "statement", e.target.value)}
                                                placeholder="Brief description of the problem or question asked..."
                                                rows="2"
                                                className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple resize-none"
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-dark-grey block mb-1">Approach & Solution Explanation</label>
                                            <textarea
                                                value={q.approach}
                                                onChange={(e) => updateCodingQuestion(i, "approach", e.target.value)}
                                                placeholder="Explain how you solved it during the interview..."
                                                rows="2"
                                                className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple resize-none"
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-dark-grey block mb-1">Code / Solution Snippet (Optional)</label>
                                            <textarea
                                                value={q.code}
                                                onChange={(e) => updateCodingQuestion(i, "code", e.target.value)}
                                                placeholder="// Paste solution code or formulas here..."
                                                rows="4"
                                                className="w-full bg-grey/80 font-mono p-3 rounded-lg text-xs border border-grey outline-none focus:border-purple resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SECTION 2: CORE CONCEPTS */}
            <div className="bg-white border border-grey rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-grey">
                    <div>
                        <h3 className="font-bold text-xl text-black">2. Core Concepts</h3>
                        <p className="text-xs text-dark-grey">OS, DBMS, Computer Networks, OOPs, or Core Branch subjects.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => toggleNA("core_concepts")}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                structure.core_concepts?.na
                                    ? "bg-red/20 text-red border border-red/30"
                                    : "bg-grey text-dark-grey hover:bg-grey/80"
                            }`}
                        >
                            {structure.core_concepts?.na ? "N/A (No Core Concepts)" : "Mark as N/A"}
                        </button>
                        {!structure.core_concepts?.na && (
                            <button
                                type="button"
                                onClick={addCoreConcept}
                                className="bg-purple text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-purple/90 transition-transform active:scale-95"
                            >
                                <i className="fi fi-rr-plus"></i> Add Concept Question
                            </button>
                        )}
                    </div>
                </div>

                {structure.core_concepts?.na ? (
                    <div className="p-4 my-4 bg-grey/30 rounded-xl text-center text-xs text-dark-grey font-medium">
                        Marked as N/A — No Core Concept Questions asked.
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mt-6">
                        {structure.core_concepts?.questions?.length === 0 && (
                            <p className="text-xs text-dark-grey italic text-center py-4">No core concept questions added yet.</p>
                        )}
                        {structure.core_concepts?.questions?.map((c, i) => (
                            <div key={c.id || i} className="border border-grey rounded-xl overflow-hidden bg-grey/10">
                                <div
                                    className="p-4 bg-grey/30 flex items-center justify-between cursor-pointer hover:bg-grey/40"
                                    onClick={() => updateCoreConcept(i, "isOpen", !c.isOpen)}
                                >
                                    <div className="flex items-center gap-3 font-semibold text-sm">
                                        <i className={`fi ${c.isOpen ? "fi-rr-angle-small-down" : "fi-rr-angle-small-right"} text-lg text-purple`}></i>
                                        <span className="bg-purple/10 text-purple px-2 py-0.5 rounded text-xs font-bold">
                                            {c.topic === "Other" ? (c.customTopic || "Subject") : c.topic}
                                        </span>
                                        <span>{c.question || "Untitled Question"}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeCoreConcept(i); }}
                                        className="text-red text-sm hover:scale-110 p-1"
                                    >
                                        <i className="fi fi-rr-trash"></i>
                                    </button>
                                </div>

                                {c.isOpen && (
                                    <div className="p-5 flex flex-col gap-4 bg-white border-t border-grey">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-dark-grey block mb-1">Subject / Domain</label>
                                                <select
                                                    value={c.topic}
                                                    onChange={(e) => updateCoreConcept(i, "topic", e.target.value)}
                                                    className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple"
                                                >
                                                    <optgroup label="CS & IT Subjects">
                                                        <option value="OS">OS (Operating Systems)</option>
                                                        <option value="DBMS">DBMS / SQL</option>
                                                        <option value="CN">Computer Networks</option>
                                                        <option value="OOPS">OOPs</option>
                                                        <option value="System Design">System Design</option>
                                                    </optgroup>
                                                    <optgroup label="Other Core Branches">
                                                        <option value="Electronics / ECE">Electronics / VLSI / Embedded</option>
                                                        <option value="Mechanical">Mechanical / Thermodynamics</option>
                                                        <option value="Electrical / EEE">Electrical / Circuits</option>
                                                        <option value="Biotech / Chemical">Biotech / Chemical</option>
                                                        <option value="Civil Engg">Civil Engineering</option>
                                                        <option value="Data Analytics">Data Analytics / Excel</option>
                                                        <option value="Finance / Consulting">Finance / Consulting</option>
                                                        <option value="Aptitude & Quant">Aptitude & Quant</option>
                                                        <option value="Other">Other Custom Subject...</option>
                                                    </optgroup>
                                                </select>
                                            </div>

                                            {c.topic === "Other" && (
                                                <div>
                                                    <label className="text-xs font-bold text-dark-grey block mb-1">Custom Subject Name</label>
                                                    <input
                                                        type="text"
                                                        value={c.customTopic}
                                                        onChange={(e) => updateCoreConcept(i, "customTopic", e.target.value)}
                                                        placeholder="e.g. Fluid Mechanics"
                                                        className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple"
                                                    />
                                                </div>
                                            )}

                                            <div className={c.topic === "Other" ? "md:col-span-2" : "md:col-span-3"}>
                                                <label className="text-xs font-bold text-dark-grey block mb-1">Question Asked</label>
                                                <input
                                                    type="text"
                                                    value={c.question}
                                                    onChange={(e) => updateCoreConcept(i, "question", e.target.value)}
                                                    placeholder="e.g. Explain difference between Process and Thread"
                                                    className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-dark-grey block mb-1">Answer / Discussion Notes</label>
                                            <textarea
                                                value={c.answer}
                                                onChange={(e) => updateCoreConcept(i, "answer", e.target.value)}
                                                placeholder="Detail how you answered the interviewer..."
                                                rows="3"
                                                className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SECTION 3: PROJECT RELATED */}
            <div className="bg-white border border-grey rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-grey">
                    <div>
                        <h3 className="font-bold text-xl text-black">3. Project Related Questions</h3>
                        <p className="text-xs text-dark-grey">Questions asked about your resume projects, capstone, or research work.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => toggleNA("project_related")}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                structure.project_related?.na
                                    ? "bg-red/20 text-red border border-red/30"
                                    : "bg-grey text-dark-grey hover:bg-grey/80"
                            }`}
                        >
                            {structure.project_related?.na ? "N/A (No Project Questions)" : "Mark as N/A"}
                        </button>
                        {!structure.project_related?.na && (
                            <button
                                type="button"
                                onClick={addProjectQuestion}
                                className="bg-purple text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-purple/90 transition-transform active:scale-95"
                            >
                                <i className="fi fi-rr-plus"></i> Add Project Question
                            </button>
                        )}
                    </div>
                </div>

                {structure.project_related?.na ? (
                    <div className="p-4 my-4 bg-grey/30 rounded-xl text-center text-xs text-dark-grey font-medium">
                        Marked as N/A — No Project Questions asked.
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mt-6">
                        {structure.project_related?.questions?.length === 0 && (
                            <p className="text-xs text-dark-grey italic text-center py-4">No project-related questions added yet.</p>
                        )}
                        {structure.project_related?.questions?.map((p, i) => (
                            <div key={p.id || i} className="border border-grey rounded-xl overflow-hidden bg-grey/10">
                                <div
                                    className="p-4 bg-grey/30 flex items-center justify-between cursor-pointer hover:bg-grey/40"
                                    onClick={() => updateProjectQuestion(i, "isOpen", !p.isOpen)}
                                >
                                    <div className="flex items-center gap-3 font-semibold text-sm">
                                        <i className={`fi ${p.isOpen ? "fi-rr-angle-small-down" : "fi-rr-angle-small-right"} text-lg text-purple`}></i>
                                        {p.project && <span className="bg-black text-white px-2.5 py-0.5 rounded text-xs font-bold">{p.project}</span>}
                                        <span>{p.question || "Untitled Question"}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeProjectQuestion(i); }}
                                        className="text-red text-sm hover:scale-110 p-1"
                                    >
                                        <i className="fi fi-rr-trash"></i>
                                    </button>
                                </div>

                                {p.isOpen && (
                                    <div className="p-5 flex flex-col gap-4 bg-white border-t border-grey">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-dark-grey block mb-1">Project Name</label>
                                                <input
                                                    type="text"
                                                    value={p.project}
                                                    onChange={(e) => updateProjectQuestion(i, "project", e.target.value)}
                                                    placeholder="e.g. Campus Space / Solar Car Design"
                                                    className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-xs font-bold text-dark-grey block mb-1">Question Asked</label>
                                                <input
                                                    type="text"
                                                    value={p.question}
                                                    onChange={(e) => updateProjectQuestion(i, "question", e.target.value)}
                                                    placeholder="e.g. Why did you choose this architecture?"
                                                    className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-dark-grey block mb-1">Your Explanation & Key Highlights</label>
                                            <textarea
                                                value={p.answer}
                                                onChange={(e) => updateProjectQuestion(i, "answer", e.target.value)}
                                                placeholder="Explain how you answered and what trade-offs you discussed..."
                                                rows="3"
                                                className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SECTION 4: PERSONALITY / HR */}
            <div className="bg-white border border-grey rounded-2xl p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-grey">
                    <div>
                        <h3 className="font-bold text-xl text-black">4. Personality & HR Related</h3>
                        <p className="text-xs text-dark-grey">Behavioral, Managerial, and HR round questions.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => toggleNA("personality_related")}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                structure.personality_related?.na
                                    ? "bg-red/20 text-red border border-red/30"
                                    : "bg-grey text-dark-grey hover:bg-grey/80"
                            }`}
                        >
                            {structure.personality_related?.na ? "N/A (No HR Questions)" : "Mark as N/A"}
                        </button>
                        {!structure.personality_related?.na && (
                            <button
                                type="button"
                                onClick={addPersonalityQuestion}
                                className="bg-purple text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 hover:bg-purple/90 transition-transform active:scale-95"
                            >
                                <i className="fi fi-rr-plus"></i> Add HR Question
                            </button>
                        )}
                    </div>
                </div>

                {structure.personality_related?.na ? (
                    <div className="p-4 my-4 bg-grey/30 rounded-xl text-center text-xs text-dark-grey font-medium">
                        Marked as N/A — No HR / Behavioral Questions asked.
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mt-6">
                        {structure.personality_related?.questions?.length === 0 && (
                            <p className="text-xs text-dark-grey italic text-center py-4">No HR questions added yet.</p>
                        )}
                        {structure.personality_related?.questions?.map((h, i) => (
                            <div key={h.id || i} className="border border-grey rounded-xl overflow-hidden bg-grey/10">
                                <div
                                    className="p-4 bg-grey/30 flex items-center justify-between cursor-pointer hover:bg-grey/40"
                                    onClick={() => updatePersonalityQuestion(i, "isOpen", !h.isOpen)}
                                >
                                    <div className="flex items-center gap-3 font-semibold text-sm">
                                        <i className={`fi ${h.isOpen ? "fi-rr-angle-small-down" : "fi-rr-angle-small-right"} text-lg text-purple`}></i>
                                        <span>HR Question #{i + 1}: {h.question || "Untitled Question"}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removePersonalityQuestion(i); }}
                                        className="text-red text-sm hover:scale-110 p-1"
                                    >
                                        <i className="fi fi-rr-trash"></i>
                                    </button>
                                </div>

                                {h.isOpen && (
                                    <div className="p-5 flex flex-col gap-4 bg-white border-t border-grey">
                                        <div>
                                            <label className="text-xs font-bold text-dark-grey block mb-1">HR / Behavioral Question</label>
                                            <input
                                                type="text"
                                                value={h.question}
                                                onChange={(e) => updatePersonalityQuestion(i, "question", e.target.value)}
                                                placeholder="e.g. Tell me about a time you faced a challenge"
                                                className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-dark-grey block mb-1">Your Response & Strategy</label>
                                            <textarea
                                                value={h.answer}
                                                onChange={(e) => updatePersonalityQuestion(i, "answer", e.target.value)}
                                                placeholder="Explain your approach (STAR method) and what answer impressed the interviewer..."
                                                rows="3"
                                                className="w-full bg-grey/30 p-2.5 rounded-lg text-sm border border-grey outline-none focus:border-purple resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewStructureEditor;
