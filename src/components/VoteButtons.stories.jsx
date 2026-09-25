import VoteButtons from './VoteButtons';

export default {
  title: 'Components/VoteButtons',
  component: VoteButtons,
  tags: ['autodocs'],
  args: {
    onUpVote: () => {},
    onDownVote: () => {},
  },
};

export const Default = {
  args: {
    upVotesBy: [],
    downVotesBy: [],
    myVote: 0,
  },
};

export const UpVoted = {
  args: {
    upVotesBy: ['user-1', 'user-2', 'user-3'],
    downVotesBy: [],
    myVote: 1,
  },
};

export const DownVoted = {
  args: {
    upVotesBy: ['user-1'],
    downVotesBy: ['user-2', 'user-3'],
    myVote: -1,
  },
};
