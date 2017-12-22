package com.gs.dao;

import com.gs.bean.LogTx;
import com.gs.common.Pager;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Administrator on 2017/12/21.
 */
@Repository
public interface LogTxDAO extends BaseDAO{
   List<Object> listByPager(@Param("pager") Pager pager, @Param("uid") Long uid);
}
