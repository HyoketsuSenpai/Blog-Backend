import redis from './../config/db/redis_db.js';
import crypto from 'crypto';

async function getRefreshToken(refreshToken: string){
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const exists = await redis.get(`refresh:${hashedToken}`);
    return exists
}

export default getRefreshToken