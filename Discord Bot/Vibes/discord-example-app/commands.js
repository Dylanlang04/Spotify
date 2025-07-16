import 'dotenv/config';

import { InstallGlobalCommands } from './utils.js';




const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const GET_COMMAND = {
  name: 'get',
  description: 'Basic command',
  options: [
    {
      name: 'title',
      description: 'Title of the song (Exact)',
      type: 3,
      required: true
    },
    {
      name: 'artist',
      description: 'Artist (exact)',
      type: 3,
      required: true
    }
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};
const UPLOAD_COMMAND = {
  name: 'upload',
  description: 'Upload and music file + artist and title',
  options: [
    {
      name: 'file',
      description: 'The music file to upload',
      type: 11,
      required: true
    },
    {
      name: 'title',
      description: 'Title of the song',
      type: 3,
      required: true
    },
    {
      name: 'artist',
      description: 'Artist name',
      type: 3,
      required: true
    }
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2]
}
const UPLOAD_PLAYLIST_COMMAND = {
  name: 'upload_playlist',
  description: 'Upload a playlist from spotify',
  type: 1,
  integration_types: [0, 1],
  contexts: [0,1,2],
  options: [
    {
      name: 'playlist', 
      type: 3,
      description: 'spotify playlist URL, (MUST BE PUBLIC PLAYLIST)',
      required: true
    }
  ]
}


const ALL_COMMANDS = [TEST_COMMAND, GET_COMMAND, UPLOAD_COMMAND, UPLOAD_PLAYLIST_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
//InstallGuildCommands(process.env.APP_ID, process.env.GUILD_ID, ALL_COMMANDS)
