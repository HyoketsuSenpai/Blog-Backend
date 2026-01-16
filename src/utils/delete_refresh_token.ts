import redis from "../config/db/redis_db.js";
import getRefreshToken from "./get_refresh_token.js";
import crypto from 'crypto';

async function deleteRefreshToken(refreshToken:string) {

    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await redis.del(`refresh:${hashedToken}`);

}

export default deleteRefreshToken