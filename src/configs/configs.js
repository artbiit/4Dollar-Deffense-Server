import { RESPONSE_SUCCESS_CODE, GlobalFailCode } from '../constants/handlerIds.js';
import {
  PACKET_TYPE_LENGTH,
  PACKET_PAYLOAD_LENGTH,
  PACKET_SEQUENCE_LENGTH,
  PACKET_VERSION_LENGTH,
  PacketType,
} from '../constants/header.js';
import { CLIENT_VERSIONS } from '../constants/constants.js';
import env from '../constants/env.js';
import { REDIS_MATCH_REQUEST_CHANNEL } from '../constants/redis.js';
import { ASSET_TYPE } from '../constants/assets.js';

const configs = {
  ASSET_TYPE,
  GlobalFailCode,
  RESPONSE_SUCCESS_CODE,
  CLIENT_VERSIONS,
  PACKET_TYPE_LENGTH,
  PACKET_PAYLOAD_LENGTH,
  PACKET_SEQUENCE_LENGTH,
  PACKET_VERSION_LENGTH,
  PACKET_TOTAL_LENGTH:
    PACKET_TYPE_LENGTH + PACKET_PAYLOAD_LENGTH + PACKET_SEQUENCE_LENGTH + PACKET_VERSION_LENGTH,
  PacketType,
  REDIS_MATCH_REQUEST_CHANNEL,
  ...env,
};

export default configs;
