import redis from './../config/db/redis_db.js';
import crypto from 'crypto';

async function setRefreshToken(refreshToken: string){
    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await redis.set(`refresh:${hashedToken}`, refreshToken, {
        expiration: {
            type: 'EX',
            value: 60 * 60 * 24 * 60
        }
    });

}

export default setRefreshToken