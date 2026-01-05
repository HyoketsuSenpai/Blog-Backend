import { createClient } from "redis";

const redis = createClient();

redis.on('error', err => console.log('Redis Client Error', err));

export async function connectRedis() {
    if(!redis.isOpen) await redis.connect();
    return redis;    
}

export default redis