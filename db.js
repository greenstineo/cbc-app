/**
 * CBC Assessment Portal - Local Data Access Layer (8-Level Rubric)
 */

const CBC_DB = {
  // Map numeric rating (1-8) to 8-level CBC Rubric codes
  getRubricLevel(rating) {
    const levels = {
      8: 'EE1', 7: 'EE2',
      6: 'ME1', 5: 'ME2',
      4: 'AE1', 3: 'AE2',
      2: 'BE1', 1: 'BE2'
    };
    return levels[rating] || 'ME1';
  },

  state: {
    learners: [],
    assessments: []
  },

  init() {
    console.log("CBC Database Module initialized with 8-Level Rubric.");
  },

  addLearner(admNo, name, grade, gender) {
    const learner = { id: Date.now(), admNo, name, grade, gender };
    this.state.learners.push(learner);
    return learner;
  },

  recordAssessment(learnerId, subStrandId, rating, remarks = '') {
    const assessment = {
      id: Date.now(),
      learnerId,
      subStrandId,
      rating,
      rubricLevel: this.getRubricLevel(rating),
      remarks,
      date: new Date().toISOString().split('T')[0]
    };
    this.state.assessments.push(assessment);
    return assessment;
  }
};

if (typeof module !== 'undefined') {
  module.exports = CBC_DB;
}
