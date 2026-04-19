/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Server is up and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: {type: string}
 *                 modules: {type: string}
 */
