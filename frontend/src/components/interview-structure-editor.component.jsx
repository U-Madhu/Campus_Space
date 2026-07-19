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
            topic: "DBMS",
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

    // 3. Project Questions handlers
    const addProjectQuestion = () => {
        const current = structure.project_related || { na: false, questions: [] };
        const newQuestion = {
            id: Date.now().toString(),
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

    // 4. HR Questions handlers
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
        <div className="w-full my-6 flex flex-col gap-5 font-sans">
            {/* Header info text */}
            <div className="bg-grey/30 p-3.5 rounded-xl border border-grey text-center font-sans">
                <p className="text-xs font-semibold text-dark-grey font-sans">
                    Fill in the interview sections below. Use the Mark as N/A button if a section was not asked.
                </p>
            </div>

            {/* SECTION 0: SELECTION PROCESS */}
            <div className="bg-white border border-grey rounded-2xl p-5 shadow-sm font-sans">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-grey">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setIsSelectionOpen(!isSelectionOpen)}>
                        <i className={`fi ${isSelectionOpen ? "fi-rr-angle-small-down" : "fi-rr-angle-small-right"} text-xl text-purple`}></i>
                        <h3 className="font-bold text-lg text-black font-sans">Selection Process</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => toggleNA("selection_process")}
                            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all font-sans whitespace-nowrap ${
                                structure.selection_process?.na
                                    ? "bg-grey text-dark-grey border border-grey"
                                    : "bg-grey text-black hover:bg-grey/80 border border-grey"
                            }`}
                        >
                            {structure.selection_process?.na ? "N/A" : "Mark as N/A"}
                        </button>
                    </div>
                </div>

                {structure.selection_process?.na ? (
                    <div className="p-3 my-3 bg-grey/30 rounded-xl text-center text-xs text-dark-grey font-medium font-sans">
                        Marked as N/A
                    </div>
                ) : isSelectionOpen && (
                    <div className="flex flex-col gap-5 mt-4">
                        <div>
                            <label className="text-xs font-bold text-dark-grey block mb-2.5 uppercase tracking-wider font-sans">
                                Select rounds conducted:
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                {roundList.map((round) => {
                                    const isChecked = currentSelectionRounds[round.key] || false;

                                    return (
                                        <button
                                            key={round.key}
                                            type="button"
                                            onClick={() => toggleRound(round.key)}
                                            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all font-sans ${
                                                isChecked
                                                    ? "bg-grey/80 text-black border-purple/60 shadow-2xs"
                                                    : "bg-white text-dark-grey border-grey hover:bg-grey/30"
                                            }`}
                                        >
                                            <span className="font-sans">{round.label}</span>
                                            <span className={`w-4 h-4 rounded-md flex items-center justify-center border text-[9px] font-sans ${
                                                isChecked ? "bg-purple text-white border-purple font-bold" : "border-grey"
                                            }`}>
                                                {isChecked ? "✓" : ""}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-dark-grey block mb-1 font-sans">
                                Selection Process Notes (Optional)
                            </label>
                            <textarea
                                value={structure.selection_process?.notes || ""}
                                onChange={(e) => updateSelectionNotes(e.target.value)}
                                placeholder="e.g. Cut-off CGPA was 8.0, 90 min OA with 2 DSA problems..."
                                rows="2"
                                className="w-full bg-grey/20 p-2.5 rounded-lg text-xs border border-grey outline-none focus:border-purple resize-none font-sans"
                            ></textarea>
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION 1: CODING QUESTIONS */}
            <div className="bg-white border border-grey rounded-2xl p-5 shadow-sm font-sans">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-grey">
                    <h3 className="font-bold text-lg text-black font-sans">Coding Questions</h3>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => toggleNA("coding")}
                            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all font-sans whitespace-nowrap ${
                                structure.coding?.na
                                    ? "bg-grey text-dark-grey border border-grey"
                                    : "bg-grey text-black hover:bg-grey/80 border border-grey"
                            }`}
                        >
                            {structure.coding?.na ? "N/A" : "Mark as N/A"}
                        </button>
                        {!structure.coding?.na && (
                            <button
                                type="button"
                                onClick={addCodingQuestion}
                                className="bg-purple text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-purple/90 font-sans"
                            >
                                <i className="fi fi-rr-plus text-[10px]"></i>
                                <span>Add Coding Problem</span>
                            </button>
                        )}
                    </div>
                </div>

                {structure.coding?.na ? (
                    <div className="p-3 my-3 bg-grey/30 rounded-xl text-center text-xs text-dark-grey font-medium font-sans">
                        Marked as N/A
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mt-4 font-sans">
                        {structure.coding?.questions?.map((q, index) => (
                            <div key={q.id || index} className="border border-grey rounded-xl p-4 bg-grey/10 flex flex-col gap-3 font-sans">
                                <div className="flex items-center justify-between gap-3 pb-2 border-b border-grey">
                                    <span className="font-bold text-xs text-black font-sans">Problem #{index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeCodingQuestion(index)}
                                        className="text-red hover:underline text-xs font-semibold font-sans"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2">
                                        <label className="text-[11px] font-bold text-dark-grey block mb-1 font-sans">Problem Title</label>
                                        <input
                                            type="text"
                                            value={q.title || ""}
                                            onChange={(e) => updateCodingQuestion(index, "title", e.target.value)}
                                            placeholder="e.g. Two Sum"
                                            className="w-full bg-white p-2 rounded-lg text-xs border border-grey outline-none focus:border-purple font-sans"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-dark-grey block mb-1 font-sans">Difficulty</label>
                                        <select
                                            value={q.difficulty || "Easy"}
                                            onChange={(e) => updateCodingQuestion(index, "difficulty", e.target.value)}
                                            className="w-full bg-white p-2 rounded-lg text-xs border border-grey outline-none focus:border-purple font-sans"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[11px] font-bold text-dark-grey block mb-1 font-sans">LeetCode Link (Optional)</label>
                                        <input
                                            type="text"
                                            value={q.leetcode || ""}
                                            onChange={(e) => updateCodingQuestion(index, "leetcode", e.target.value)}
                                            placeholder="https://leetcode.com/problems/..."
                                            className="w-full bg-white p-2 rounded-lg text-xs border border-grey outline-none focus:border-purple font-sans"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-dark-grey block mb-1 font-sans">YouTube Link (Optional)</label>
                                        <input
                                            type="text"
                                            value={q.youtube || ""}
                                            onChange={(e) => updateCodingQuestion(index, "youtube", e.target.value)}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className="w-full bg-white p-2 rounded-lg text-xs border border-grey outline-none focus:border-purple font-sans"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-dark-grey block mb-1 font-sans">Article Link (Optional)</label>
                                        <input
                                            type="text"
                                            value={q.resource || ""}
                                            onChange={(e) => updateCodingQuestion(index, "resource", e.target.value)}
                                            placeholder="https://geeksforgeeks.org/..."
                                            className="w-full bg-white p-2 rounded-lg text-xs border border-grey outline-none focus:border-purple font-sans"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-dark-grey block mb-1 font-sans">Problem Details (Optional)</label>
                                    <textarea
                                        value={q.statement || ""}
                                        onChange={(e) => updateCodingQuestion(index, "statement", e.target.value)}
                                        placeholder="Brief problem statement or constraints..."
                                        rows="2"
                                        className="w-full bg-white p-2 rounded-lg text-xs border border-grey outline-none focus:border-purple resize-none font-sans"
                                    ></textarea>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SECTION 2: CORE CONCEPTS */}
            <div className="bg-white border border-grey rounded-2xl p-5 shadow-sm font-sans">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-grey">
                    <h3 className="font-bold text-lg text-black font-sans">Core Concepts</h3>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => toggleNA("core_concepts")}
                            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all font-sans whitespace-nowrap ${
                                structure.core_concepts?.na
                                    ? "bg-grey text-dark-grey border border-grey"
                                    : "bg-grey text-black hover:bg-grey/80 border border-grey"
                            }`}
                        >
                            {structure.core_concepts?.na ? "N/A" : "Mark as N/A"}
                        </button>
                        {!structure.core_concepts?.na && (
                            <button
                                type="button"
                                onClick={addCoreConcept}
                                className="bg-purple text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-purple/90 font-sans"
                            >
                                <i className="fi fi-rr-plus text-[10px]"></i>
                                <span>Add Core Question</span>
                            </button>
                        )}
                    </div>
                </div>

                {structure.core_concepts?.na ? (
                    <div className="p-3 my-3 bg-grey/30 rounded-xl text-center text-xs text-dark-grey font-medium font-sans">
                        Marked as N/A
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mt-4 font-sans">
                        {structure.core_concepts?.questions?.map((c, index) => (
                            <div key={c.id || index} className="border border-grey rounded-xl p-4 bg-grey/10 flex flex-col gap-3 font-sans">
                                <div className="flex items-center justify-between gap-3 pb-2 border-b border-grey">
                                    <span className="font-bold text-xs text-black font-sans font-sans">Concept Question #{index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeCoreConcept(index)}
                                        className="text-red hover:underline text-xs font-semibold font-sans"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[11px] font-bold text-dark-grey block mb-1 font-sans">Subject</label>
                                        <select
                                            value={c.topic || "DBMS"}
                                            onChange={(e) => updateCoreConcept(index, "topic", e.target.value)}
                                            className="w-full bg-white p-2 rounded-lg text-xs border border-grey outline-none focus:border-purple font-sans"
                                        >
                                            <option value="DBMS">DBMS</option>
                                            <option value="OS">OS</option>
                                            <option value="CN">CN</option>
                                            <option value="OOPs">OOPs</option>
                                            <option value="System Design">System Design</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-[11px] font-bold text-dark-grey block mb-1 font-sans">Question Asked</label>
                                        <input
                                            type="text"
                                            value={c.question || ""}
                                            onChange={(e) => updateCoreConcept(index, "question", e.target.value)}
                                            placeholder="e.g. What are ACID properties?"
                                            className="w-full bg-white p-2 rounded-lg text-xs border border-grey outline-none focus:border-purple font-sans"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-dark-grey block mb-1 font-sans">Answer Notes (Optional)</label>
                                    <textarea
                                        value={c.answer || ""}
                                        onChange={(e) => updateCoreConcept(index, "answer", e.target.value)}
                                        placeholder="Key points discussed..."
                                        rows="2"
                                        className="w-full bg-white p-2 rounded-lg text-xs border border-grey outline-none focus:border-purple resize-none font-sans"
                                    ></textarea>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SECTION 3: PROJECT RELATED QUESTIONS */}
            <div className="bg-white border border-grey rounded-2xl p-5 shadow-sm font-sans">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-grey">
                    <h3 className="font-bold text-lg text-black font-sans">Project Related Questions</h3>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => toggleNA("project_related")}
                            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all font-sans whitespace-nowrap ${
                                structure.project_related?.na
                                    ? "bg-grey text-dark-grey border border-grey"
                                    : "bg-grey text-black hover:bg-grey/80 border border-grey"
                            }`}
                        >
                            {structure.project_related?.na ? "N/A" : "Mark as N/A"}
                        </button>
                        {!structure.project_related?.na && (
                            <button
                                type="button"
                                onClick={addProjectQuestion}
                                className="bg-purple text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-purple/90 font-sans"
                            >
                                <i className="fi fi-rr-plus text-[10px]"></i>
                                <span>Add Project Question</span>
                            </button>
                        )}
                    </div>
                </div>

                {structure.project_related?.na ? (
                    <div className="p-3 my-3 bg-grey/30 rounded-xl text-center text-xs text-dark-grey font-medium font-sans">
                        Marked as N/A
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mt-4 font-sans">
                        {structure.project_related?.questions?.map((p, index) => (
                            <div key={p.id || index} className="border border-grey rounded-xl p-4 bg-grey/10 flex flex-col gap-3 font-sans">
                                <div className="flex items-center justify-between gap-3 pb-2 border-b border-grey font-sans">
                                    <span className="font-bold text-xs text-black font-sans">Project Question #{index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeProjectQuestion(index)}
                                        className="text-red hover:underline text-xs font-semibold font-sans"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-dark-grey block mb-1 font-sans">Question Asked</label>
                                    <input
                                        type="text"
                                        value={p.question || ""}
                                        onChange={(e) => updateProjectQuestion(index, "question", e.target.value)}
                                        placeholder="e.g. Why did you choose MongoDB?"
                                        className="w-full bg-white p-2 rounded-lg text-xs border border-grey outline-none focus:border-purple font-sans"
                                    />
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-dark-grey block mb-1 font-sans">Answer Notes (Optional)</label>
                                    <textarea
                                        value={p.answer || ""}
                                        onChange={(e) => updateProjectQuestion(index, "answer", e.target.value)}
                                        placeholder="Key discussion points..."
                                        rows="2"
                                        className="w-full bg-white p-2 rounded-lg text-xs border border-grey outline-none focus:border-purple resize-none font-sans"
                                    ></textarea>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SECTION 4: HR & PERSONALITY */}
            <div className="bg-white border border-grey rounded-2xl p-5 shadow-sm font-sans">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-grey">
                    <h3 className="font-bold text-lg text-black font-sans">HR & Behavioral Questions</h3>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => toggleNA("personality_related")}
                            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all font-sans whitespace-nowrap ${
                                structure.personality_related?.na
                                    ? "bg-grey text-dark-grey border border-grey"
                                    : "bg-grey text-black hover:bg-grey/80 border border-grey"
                            }`}
                        >
                            {structure.personality_related?.na ? "N/A" : "Mark as N/A"}
                        </button>
                        {!structure.personality_related?.na && (
                            <button
                                type="button"
                                onClick={addPersonalityQuestion}
                                className="bg-purple text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-purple/90 font-sans"
                            >
                                <i className="fi fi-rr-plus text-[10px]"></i>
                                <span>Add HR Question</span>
                            </button>
                        )}
                    </div>
                </div>

                {structure.personality_related?.na ? (
                    <div className="p-3 my-3 bg-grey/30 rounded-xl text-center text-xs text-dark-grey font-medium font-sans">
                        Marked as N/A
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 mt-4 font-sans">
                        {structure.personality_related?.questions?.map((pr, index) => (
                            <div key={pr.id || index} className="border border-grey rounded-xl p-4 bg-grey/10 flex flex-col gap-3 font-sans">
                                <div className="flex items-center justify-between gap-3 pb-2 border-b border-grey font-sans">
                                    <span className="font-bold text-xs text-black font-sans">HR Question #{index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => removePersonalityQuestion(index)}
                                        className="text-red hover:underline text-xs font-semibold font-sans"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-dark-grey block mb-1 font-sans">Question Asked</label>
                                    <input
                                        type="text"
                                        value={pr.question || ""}
                                        onChange={(e) => updatePersonalityQuestion(index, "question", e.target.value)}
                                        placeholder="e.g. Tell me about a time you handled a conflict."
                                        className="w-full bg-white p-2 rounded-lg text-xs border border-grey outline-none focus:border-purple font-sans"
                                    />
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-dark-grey block mb-1 font-sans">Answer Strategy (Optional)</label>
                                    <textarea
                                        value={pr.answer || ""}
                                        onChange={(e) => updatePersonalityQuestion(index, "answer", e.target.value)}
                                        placeholder="STAR method response..."
                                        rows="2"
                                        className="w-full bg-white p-2 rounded-lg text-xs border border-grey outline-none focus:border-purple resize-none font-sans"
                                    ></textarea>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewStructureEditor;
