package com.gs;

import com.gs.bean.Bz;
import com.gs.bean.DxModel;
import com.gs.common.Pager;
import com.gs.service.BzService;
import com.gs.service.DxModelService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

/**
 * Created by ：余鹏
 * time：2018/1/3.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:/config/spring-*.xml"})
public class DxModelTest {

    @Resource
    private DxModelService dxModelService;

    @Test
    public void DxModelsavetest(){
        DxModel dxModel=new DxModel();
        dxModel.setDxid(1L);
        dxModel.setContent("您的验证码为123456，请妥善保管！");
        dxModelService.save(dxModel);
    }

    @Test
    public void DxModelupdatetest(){
        DxModel dxModel=new DxModel();
        dxModel.setDxid(1L);
        dxModel.setContent("您的验证码为654321，请妥善保管！");
        dxModelService.update(dxModel);
    }

    @Test
    public void DxModelremoveByIdtest(){
        dxModelService.removeById(1L);
    }

    @Test
    public void  DxModelListByPager(){
        dxModelService.listPagerCriteria(1,2,null);
    }

}