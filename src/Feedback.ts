class Feedback{
    private userName: string | null = null;
    private evaluation: 'Отлично' | 'Плохо' | 'Удовлетворительно' | null = null;
    private comment: string | null = null;

    setUsername = (userName: string) => {
        this.userName = userName;
    }

    setEvaluation = (evaluation: 'Отлично' | 'Плохо' | 'Удовлетворительно') => {
        this.evaluation = evaluation;
    }

    setComment = (comment: string) => {
        this.comment = comment;
    }

    getUserName = () => this.userName;

    getEvaluation = () => this.evaluation;

    getComment = () => this.comment;
}

export default Feedback;