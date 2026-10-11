/**
 * CBC Assessment Portal - Local Data Access Layer
 */

const CBC_DB = {
  // Convert numeric ratings (1-4) to standard CBC Rubric codes
  getRubricLevel(rating) {
    const levels = { 4: 'EE', 3: 'ME', 2: 'AE', 1: 'BE' };
    return levels[rating] || 'ME';
  },

  state: {
    learners: [],
    assessments: []
  },

  init() {
    console.log("CBC Database Module loaded successfully.");
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
