declare var global, describe, test, expect, require, process, beforeAll, afterAll

const sinon = require('sinon')

import * as chai from 'chai'

const assert = chai.assert

import db from '../../db'
import '../../config'

import {mail} from '../../utility'

import UserService from '../UserService'
import TaskService from '../TaskService'

const testData: any = {}
let DB, taskServiceMember, taskServiceOrganizer, taskServiceAdmin, mailMethod

import {constant} from '../../constant';

/**
 * global.DB is declared in test/unit/setup.js
 *
 * TODO: find a reload function for a sequelize object
 */
beforeAll(async ()=>{
    DB = await db.create()

    // stub mail
    mailMethod = sinon.stub(mail, 'send', (options) => {
        console.log('mail suppressed', options)
        return Promise.resolve();
    });

    // remove test user
    await DB.getModel('User').remove({
        username: global.DB.MEMBER_USER.username
    });
    await DB.getModel('User').remove({
        username: global.DB.ORGANIZER_USER.username
    });

    // create a test user as member role
    const userService = new UserService(DB, {
        user: null
    })
    testData.organizer = await userService.registerNewUser(global.DB.ORGANIZER_USER)
    testData.admin = await userService.getDBModel('User').findOne(global.DB.ADMIN_USER)

    // set member to organizer
    await userService.getDBModel('User').update({_id: testData.organizer._id}, {role: 'LEADER'})

    testData.organizer = await userService.getDBModel('User').findOne({username: global.DB.ORGANIZER_USER.username})

    // create social task
    taskServiceOrganizer = new TaskService(DB, {
        user: testData.organizer
    })

    testData.taskSocialEvent = await taskServiceOrganizer.create(global.DB.TASK_1)

    // initialize this
    taskServiceAdmin = new TaskService(DB, {
        user: testData.admin
    })

    testData.member = await userService.registerNewUser(global.DB.MEMBER_USER)

    taskServiceMember = new TaskService(DB, {
        user: testData.member
    })
})

describe('Tests for Task Update', () => {

    test('Make sure task is initially PENDING', async () => {
        expect(testData.taskSocialEvent.status).toBe(constant.TASK_STATUS.PENDING)
    })

    test('Member cannot change anything', async () => {

        try {
            await taskServiceMember.update({
                taskId: testData.taskSocialEvent._id,
                status: constant.TASK_STATUS.SUCCESS
            })

            assert.fail('Should fail with Access Denied')

        } catch (err) {
            expect(err).toBe('Access Denied')
        }
    })

    test('Task cannot be set from PENDING to ASSIGNED by organizer', async () => {
        // however admin can change it to anything
        await taskServiceOrganizer.update({
            taskId: testData.taskSocialEvent._id,
            status: constant.TASK_STATUS.ASSIGNED
        })

        testData.taskSocialEvent = await DB.getModel('Task').findOne({
            _id: testData.taskSocialEvent._id
        })

        expect(testData.taskSocialEvent.status).toBe(constant.TASK_STATUS.PENDING)
    })

    test('Make sure only admin can set to APPROVED', async () => {

        try {

            await taskServiceOrganizer.update({
                taskId: testData.taskSocialEvent._id,
                status: constant.TASK_STATUS.APPROVED
            })

            assert.fail('Should fail with Access Denied')

        } catch (err) {
            expect(err).toBe('Access Denied')
        }

        mailMethod.reset()

        await taskServiceAdmin.update({
            taskId: testData.taskSocialEvent._id,
            status: constant.TASK_STATUS.APPROVED
        })

        expect(mailMethod.calledOnce).toBe(true)

        testData.taskSocialEvent = await DB.getModel('Task').findOne({
            _id: testData.taskSocialEvent._id
        })

        expect(testData.taskSocialEvent.status).toBe(constant.TASK_STATUS.APPROVED)
    })

    test('Both organizer/admin can set to ASSIGNED/SUBMITTED', async () => {

        await taskServiceOrganizer.update({
            taskId: testData.taskSocialEvent._id,
            status: constant.TASK_STATUS.ASSIGNED
        })

        testData.taskSocialEvent = await DB.getModel('Task').findOne({
            _id: testData.taskSocialEvent._id
        })

        expect(testData.taskSocialEvent.status).toBe(constant.TASK_STATUS.ASSIGNED)

        // admin can change back to approved
        await taskServiceAdmin.update({
            taskId: testData.taskSocialEvent._id,
            status: constant.TASK_STATUS.APPROVED
        })
        testData.taskSocialEvent = await DB.getModel('Task').findOne({
            _id: testData.taskSocialEvent._id
        })
        expect(testData.taskSocialEvent.status).toBe(constant.TASK_STATUS.APPROVED)

        // admin can assign too
        await taskServiceAdmin.update({
            taskId: testData.taskSocialEvent._id,
            status: constant.TASK_STATUS.ASSIGNED
        })

        testData.taskSocialEvent = await DB.getModel('Task').findOne({
            _id: testData.taskSocialEvent._id
        })

        expect(testData.taskSocialEvent.status).toBe(constant.TASK_STATUS.ASSIGNED)

        // reset to APPROVED
        await taskServiceAdmin.update({
            taskId: testData.taskSocialEvent._id,
            status: constant.TASK_STATUS.APPROVED
        })

        // test SUBMITTED status - but only if assigned
        try {
            await taskServiceOrganizer.update({
                taskId: testData.taskSocialEvent._id,
                status: constant.TASK_STATUS.SUBMITTED
            })

            assert.fail('Should fail with Invalid Action')

        } catch (err) {
            expect(err).toBe('Invalid Action')
        }

        await taskServiceOrganizer.update({
            taskId: testData.taskSocialEvent._id,
            status: constant.TASK_STATUS.ASSIGNED
        })

        await taskServiceOrganizer.update({
            taskId: testData.taskSocialEvent._id,
            status: constant.TASK_STATUS.SUBMITTED
        })

        testData.taskSocialEvent = await DB.getModel('Task').findOne({
            _id: testData.taskSocialEvent._id
        })

        expect(testData.taskSocialEvent.status).toBe(constant.TASK_STATUS.SUBMITTED)
    })

    test('Only admin can set to APPROVED / CANCELED / DISTRIBUTED', async () => {

        // reset to PENDING
        await taskServiceAdmin.update({
            taskId: testData.taskSocialEvent._id,
            status: constant.TASK_STATUS.PENDING
        })

        // for organizers we already tested APPROVED
        try {

            await taskServiceOrganizer.update({
                taskId: testData.taskSocialEvent._id,
                status: constant.TASK_STATUS.DISTRIBUTED
            })

            assert.fail('Should fail with Access Denied')

        } catch (err) {
            expect(err).toBe('Access Denied')
        }

        try {

            await taskServiceOrganizer.update({
                taskId: testData.taskSocialEvent._id,
                status: constant.TASK_STATUS.CANCELED
            })

            assert.fail('Should fail with Access Denied')

        } catch (err) {
            expect(err).toBe('Access Denied')
        }

        // now try for admins, should work
        await taskServiceAdmin.update({
            taskId: testData.taskSocialEvent._id,
            status: constant.TASK_STATUS.DISTRIBUTED
        })

        testData.taskSocialEvent = await DB.getModel('Task').findOne({
            _id: testData.taskSocialEvent._id
        })

        expect(testData.taskSocialEvent.status).toBe(constant.TASK_STATUS.DISTRIBUTED)

    })

    test('Organizer cannot change budget/rewards after APPROVED status', async () => {
        // await new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve()
        //     }, 6000)
        // })
    })

})

afterAll(async () => {
    // remove test task
    await DB.getModel('Task').remove({
        _id: testData.taskSocialEvent._id
    });

    await DB.disconnect()
})
